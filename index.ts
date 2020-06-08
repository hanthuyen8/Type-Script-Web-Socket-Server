import WebSocket from 'ws';
import http from "http";
import PlayersManager from './PlayersManager';
import BaseRequest from "./DataTypes";

export enum NetworkRequest { Register, GetIdlePlayers, Challenge }

const httpServer = http.createServer((request, response) => { });
const wsServer = new WebSocket.Server({ server: httpServer });
const playersManager = new PlayersManager();

wsServer.on("connection", (client: WebSocket) =>
{
    client.onmessage = (message: WebSocket.MessageEvent) =>
    {
        let requestData = message.data;
        if (typeof requestData === "string" && requestData.length > 0)
        {
            let request = BaseRequest.tryParse(requestData);
            if (!request)
                return;

            let sendback = true;
            let response = request;
            let responseData: string | null = null;

            console.log("Receiving: " + requestData);
            switch (request.action)
            {
                case NetworkRequest[NetworkRequest.Register]:
                    responseData = playersManager.newPlayer(client, request.data);
                    break;

                case NetworkRequest[NetworkRequest.GetIdlePlayers]:
                    responseData = playersManager.getIdlesPlayers();
                    break;

                case NetworkRequest[NetworkRequest.Challenge]:
                    responseData = playersManager.challengeRequest(client, request.data);
                    if (!responseData)
                        sendback = false;

                    break;

                default:
                    sendback = false;
                    break;
            }

            if (sendback && responseData)
            {
                response.data = responseData;
                let msg = JSON.stringify(response);
                console.log("Sending Back: " + msg);
                client.send(msg);
            }
        }
    };

    client.onclose = (event: WebSocket.CloseEvent) =>
    {
        console.log("client disconnect");
        playersManager.removePlayer(client);
    };
});

export function SendMessageToClient(client: WebSocket, requestType: NetworkRequest, data: string)
{
    if (client.readyState === client.OPEN)
    {
        let request = new BaseRequest();
        request.action = NetworkRequest[requestType];
        request.data = data;

        let msg = JSON.stringify(request);
        console.log("Sending: " + msg);
        client.send(msg);
    }
}

httpServer.listen(55555, () =>
{
    console.log("Server started at http://localhost:55555");
});

// Cách chạy:
// 1. npx tsc    : biên dịch ts -> js
// 2. node .     : start server