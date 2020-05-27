export default interface ClientRequestData
{
    action: string;
    data: string;
}

//#region Register Data
export interface RegisterRequest
{
    nickName: string;
}

export class RegisterResponse
{
    success: boolean;
    message: string;

    constructor(success : boolean, message: string)
    {
        this.message = message;
        this.success = success;
    }
}
//#endregion

//#region  Get Idle Player Data
export class GetIdlePlayersResponse
{
    public playerNames: string[] = [];
}
//#endregion