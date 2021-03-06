import Helper from "./Helper";
import WebSocket from "ws";

export enum NetworkRequest { Register, GetIdlePlayers, Challenge, StartGame }
export enum PlayerStatus { Idle, InMatch }

export default class BaseRequest
{
    public action: string = "";
    public data: string = "";

    public static tryParse(json: string): BaseRequest | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as BaseRequest;
        if (Helper.stringIsEmpty(data.action))
            return null;

        return data;
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

    toJSON()
    {
        return { nickName: this.nickName };
    }
}

//#region Register Data
export class CTS_Register
{
    public nickName: string = "";

    public static tryParse(json: string): CTS_Register | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as CTS_Register;
        if (Helper.stringIsEmpty(data.nickName))
            return null;

        return data;
    }
}

export class STC_Register
{
    success: boolean;
    message: string;

    constructor(success: boolean, message: string)
    {
        this.message = message;
        this.success = success;
    }
}
//#endregion

//#region  Get Idle Player Data
export class STC_GetIdlePlayers
{
    public playerNames: string[] = [];
}
//#endregion

//#region Challenge

export class CTS_ChallengeTo
{
    public otherPlayerName: string = "";

    public static tryParse(json: string): CTS_ChallengeTo | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as CTS_ChallengeTo;
        if (Helper.stringIsEmpty(data.otherPlayerName))
            return null;

        return data;
    }
}

export class STC_ChallengeTo
{
    public success: boolean;
    public message: string;

    constructor(success: boolean, message: string)
    {
        this.success = success;
        this.message = message;
    }
}

export class STC_ChallengeFrom
{
    public challenger: string = "";
    public challengeId: string = "";
}

export class CTS_ChallengeFrom
{
    public accept: boolean = false;
    public challengeId: string = "";

    public static tryParse(json: string): CTS_ChallengeFrom | null
    {
        if (Helper.stringIsEmpty(json))
            return null;

        let data = JSON.parse(json) as CTS_ChallengeFrom;
        if (Helper.stringIsEmpty(data.challengeId) || data.accept == null)
            return null;

        return data;
    }
}
//#endregion

//#region Start Game
export class MatchData
{
    public matchId: string;
    public playerA: Player;
    public playerAScore: number = 0;

    public playerB: Player;
    public playerBScore: number = 0;

    constructor(playerA: Player, playerB: Player)
    {
        this.playerA = playerA;
        this.playerB = playerB;

        this.matchId = playerA.nickName + playerB.nickName;
    }
}
//#endregion