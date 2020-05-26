"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var http_1 = __importDefault(require("http"));
var PlayersManager_1 = __importDefault(require("./PlayersManager"));
var httpServer = http_1.default.createServer(function (request, response) { });
var wsServer = new ws_1.default.Server({ server: httpServer });
var playersManager = new PlayersManager_1.default();
wsServer.on("connection", function (client) {
    client.onmessage = function (message) {
        if (typeof message.data === "string") {
            var request = JSON.parse(message.data);
            if (!request || !request.action)
                return;
            switch (request.action) {
                case "Register":
                    playersManager.newPlayer(client, request.data);
                    client.send("Player registered.");
                    break;
                case "Get Idle Players":
                    var response = request;
                    response.data = playersManager.getIdlesPlayers();
                    client.send(JSON.stringify(response));
                    break;
            }
        }
    };
});
httpServer.listen(55555, function () {
    console.log("Server started at http://localhost:55555");
});
// Cách chạy:
// 1. npx tsc    : biên dịch ts -> js
// 2. node .     : start server
