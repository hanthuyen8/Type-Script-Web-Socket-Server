import WebSocket from "ws";
import { RegisterData, IdlePlayersData } from "./DataTypes";
export enum PlayerStatus { Idle, InMatch }

export default class PlayersManager
{
    private players: Player[] = [];

    /** 
     * Tạo mới 1 Player và set nickName cho player này 
     * @returns return về Player đó hoặc null nếu RegisterData không hợp lệ */
    public newPlayer(id: WebSocket, registerData: string): Player | null
    {
        if (!registerData || registerData.length === 0)
        {
            console.log("Invalid Register Data");
            return null;
        }

        let data = JSON.parse(registerData) as RegisterData;
        if (data && data.nickName)
        {
            let player = this.players.find(x => x.id === id);
            if (!player)
            {
                player = new Player(id, data.nickName);
                this.players.push(player);
            }
            else
            {
                player.nickName = data.nickName;
                player.status = PlayerStatus.Idle;
            }
            return player;
        }
        else
        {
            console.log("Invalid Register Data");
            return null;
        }
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
        let result = new IdlePlayersData();
        let list = result.nickNames;
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
