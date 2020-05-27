import WebSocket from 'ws';
import http from "http";
import PlayersManager, { Player } from './PlayersManager';
import ClientRequestData from "./DataTypes";

export enum NetworkRequest { Register, GetIdlePlayers }

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
            let request = JSON.parse(requestData) as ClientRequestData
            if (!request || !request.action)
                return;

            let sendback = false;
            let response = request;
            let responseData = "";

            switch (request.action)
            {
                case NetworkRequest[NetworkRequest.Register]:
                    responseData = playersManager.newPlayer(client, request.data);
                    sendback = true;
                    break;

                case NetworkRequest[NetworkRequest.GetIdlePlayers]:
                    responseData = playersManager.getIdlesPlayers();
                    sendback = true;
                    break;
            }

            if (sendback)
            {
                response.data = responseData;
                let text = JSON.stringify(response);
                console.log(text);
                client.send(text);
            }
        }
    };

    client.onclose = (event: WebSocket.CloseEvent) =>
    {
        console.log("client disconnect");
        playersManager.removePlayer(client);
    };
});

httpServer.listen(55555, () =>
{
    console.log("Server started at http://localhost:55555");
});

// Cách chạy:
// 1. npx tsc    : biên dịch ts -> js
// 2. node .     : start server