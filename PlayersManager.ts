import WebSocket from "ws";
import BaseRequest, { CTS_Register, STC_Register, STC_GetIdlePlayers, STC_ChallengeTo, STC_ChallengeFrom, CTS_ChallengeTo, CTS_ChallengeFrom } from "./DataTypes";
import { NetworkRequest, SendMessageToClient } from ".";
import Helper from "./Helper";
export enum PlayerStatus { Idle, InMatch }

export default class PlayersManager
{
    private players: Player[] = [];
    private challenge: Challenge = new Challenge();

    /** 
     * Tạo mới 1 Player và set nickName cho player này 
     * @returns return về Player đó hoặc null nếu RegisterData không hợp lệ */
    public newPlayer(id: WebSocket, registerData: string): string
    {
        let data = CTS_Register.tryParse(registerData);
        if (!data)
            return JSON.stringify(new STC_Register(false, "Yêu cầu không hợp lệ."));

        let nickName = data.nickName;
        let player = this.players.find(x => x.nickName === nickName);
        if (!player)
        {
            player = new Player(id, data.nickName);
            this.players.push(player);
            return JSON.stringify(new STC_Register(true, "Đăng ký thành công."));
        }
        return JSON.stringify(new STC_Register(false, "Tên đã có người sử dụng."));
    }

    /** Xóa Player */
    public removePlayer(id: WebSocket)
    {
        let index = this.players.findIndex(x => x.id === id);
        if (index > 0)
            this.players.splice(index, 1);
    }

    /** Lấy ra danh sách tất cả các Player nào đang Idle */
    public getIdlesPlayers(): string
    {
        let result = new STC_GetIdlePlayers();
        let list = result.playerNames;
        for (let p of this.players)
        {
            if (p.status === PlayerStatus.Idle)
                list.push(p.nickName);
        }
        return JSON.stringify(result);
    }

    public challengeRequest(senderId: WebSocket, requestData: string): string | null
    {
        // Lọc request

        let to = CTS_ChallengeTo.tryParse(requestData)
        if (to)
            return this.challengeOtherPlayer(senderId, to);

        let from = CTS_ChallengeFrom.tryParse(requestData)
        if (from)
            this.challenge.acceptChallenge(from.challengeId, from.accept);

        return null;
    }

    private challengeOtherPlayer(senderId: WebSocket, data: CTS_ChallengeTo): string | null
    {
        let otherPlayerName = data.otherPlayerName;
        let challenger = this.players.find(x => x.id === senderId);
        let other = this.players.find(x => x.nickName === otherPlayerName);

        if (!challenger || !other)
            return JSON.stringify(new STC_ChallengeTo(false, "Yêu cầu không hợp lệ"));

        if (other.status === PlayerStatus.InMatch)
        {
            return JSON.stringify(new STC_ChallengeTo(false, `Người chơi: ${other.nickName} đang trong trận.`));
        }

        this.challenge.newChallenge(challenger, other);
        return null;
    }
}

export class Player
{
    public id: WebSocket;
    public nickName: string;
    public status: PlayerStatus;

    constructor(id: WebSocket, nickName: string)
    {
        this.id = id;
        this.nickName = nickName;
        this.status = PlayerStatus.Idle;
    }
}

export class Challenge
{
    // Cách thức hoạt động
    // 1. playerA gửi message lên cho server muốn challenge playerB
    // 2. server kiểm tra hợp lệ rồi lưu playerA vào danh sách challenge với đối thủ là playerB
    // 3. server gửi message cho playerB rằng playerA muốn challenge
    // 4. playerB gửi trả message cho server
    // 5. Nếu playerB đồng ý thì server gửi message start game cho cả 2
    // 6. Nếu playerB không đồng ý thì server gửi message thông báo cho playerA

    private challenges: Map<string, ChallengeData> = new Map;

    public newChallenge(challenger: Player, other: Player)
    {
        let challengeId = challenger.nickName + other.nickName;
        if (!this.challenges.has(challengeId))
        {
            let data = new ChallengeData(challenger, other);
            this.challenges.set(challengeId, data);

            let challengeRequest = new STC_ChallengeFrom();
            challengeRequest.challengeId = challengeId;
            challengeRequest.challenger = challenger.nickName;

            SendMessageToClient(other.id, NetworkRequest.Challenge, JSON.stringify(challengeRequest));
        }
    }

    public acceptChallenge(challengeId: string, accept: boolean)
    {
        let data = this.challenges.get(challengeId);
        if (data)
        {
            if (accept)
            {
                // start game ở cả 2 client
            }
            else
            {
                let challengeResponse = new STC_ChallengeTo(false, `Người chơi: ${data.other.nickName} không đồng ý thách đấu.`);
                SendMessageToClient(data.challenger.id, NetworkRequest.Challenge, JSON.stringify(challengeResponse));
            }
            this.challenges.delete(challengeId);
        }
    }
}

class ChallengeData
{
    public challenger: Player;
    public other: Player;

    constructor(challenger: Player, other: Player)
    {
        this.challenger = challenger;
        this.other = other;
    }
}
