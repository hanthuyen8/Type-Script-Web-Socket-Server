export default interface ClientRequestData
{
    action: string;
    data: string;
}

export interface RegisterData
{
    nickName: string;
}

export class IdlePlayersData
{
    public nickNames: string[] = [];
}