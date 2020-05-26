import WebSocket from 'ws';
import http from "http";
import PlayersManager, { Player } from './PlayersManager';
import ClientRequestData from "./DataTypes";

const httpServer = http.createServer((request, response) => { });
const wsServer = new WebSocket.Server({ server: httpServer });
const playersManager = new PlayersManager();

wsServer.on("connection", (client: WebSocket) =>
{
    client.onmessage = (message: WebSocket.MessageEvent) =>
    {
        if (typeof message.data === "string")
        {
            let request = JSON.parse(message.data) as ClientRequestData
            if (!request || !request.action)
                return;

            switch (request.action)
            {
                case "Register":
                    playersManager.newPlayer(client, request.data);
                    client.send("Player registered.");
                    break;

                case "Get Idle Players":
                    let response = request;
                    response.data = playersManager.getIdlesPlayers();
                    client.send(JSON.stringify(response));
                    break;
            }
        }
    };
});

httpServer.listen(55555, () =>
{
    console.log("Server started at http://localhost:55555");
});

// Cách chạy:
// 1. npx tsc    : biên dịch ts -> js
// 2. node .     : start server