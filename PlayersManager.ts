import WebSocket from "ws";
import { RegisterRequest, RegisterResponse, GetIdlePlayersResponse } from "./DataTypes";
export enum PlayerStatus { Idle, InMatch }

export default class PlayersManager
{
    private players: Player[] = [];

    /** 
     * Tạo mới 1 Player và set nickName cho player này 
     * @returns return về Player đó hoặc null nếu RegisterData không hợp lệ */
    public newPlayer(id: WebSocket, registerData: string): string
    {
        if (!registerData || registerData.length === 0)
        {
            return JSON.stringify(new RegisterResponse(false, "Invalid Register Data"));
        }

        let data = JSON.parse(registerData) as RegisterRequest;
        if (data && data.nickName)
        {
            let player = this.players.find(x => x.nickName === data.nickName);
            if (!player)
            {
                player = new Player(id, data.nickName);
                this.players.push(player);
                return JSON.stringify(new RegisterResponse(true, "Register Successful"));
            }
            return JSON.stringify(new RegisterResponse(true, "This Nick Name Is Already In Use."));
        }
        return JSON.stringify(new RegisterResponse(false, "Invalid Register Data"));
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
        let result = new GetIdlePlayersResponse();
        let list = result.playerNames;
        for (let p of this.players)
        {
            if (p.status === PlayerStatus.Idle)
                list.push(p.nickName);
        }
        return JSON.stringify(result);
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
