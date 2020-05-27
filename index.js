"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkRequest = void 0;
var ws_1 = __importDefault(require("ws"));
var http_1 = __importDefault(require("http"));
var PlayersManager_1 = __importDefault(require("./PlayersManager"));
var NetworkRequest;
(function (NetworkRequest) {
    NetworkRequest[NetworkRequest["Register"] = 0] = "Register";
    NetworkRequest[NetworkRequest["GetIdlePlayers"] = 1] = "GetIdlePlayers";
})(NetworkRequest = exports.NetworkRequest || (exports.NetworkRequest = {}));
var httpServer = http_1.default.createServer(function (request, response) { });
var wsServer = new ws_1.default.Server({ server: httpServer });
var playersManager = new PlayersManager_1.default();
wsServer.on("connection", function (client) {
    client.onmessage = function (message) {
        var requestData = message.data;
        if (typeof requestData === "string" && requestData.length > 0) {
            var request = JSON.parse(requestData);
            if (!request || !request.action)
                return;
            var sendback = false;
            var response = request;
            var responseData = "";
            switch (request.action) {
                case NetworkRequest[NetworkRequest.Register]:
                    responseData = playersManager.newPlayer(client, request.data);
                    sendback = true;
                    break;
                case NetworkRequest[NetworkRequest.GetIdlePlayers]:
                    responseData = playersManager.getIdlesPlayers();
                    sendback = true;
                    break;
            }
            if (sendback) {
                response.data = responseData;
                var text = JSON.stringify(response);
                console.log(text);
                client.send(text);
            }
        }
    };
    client.onclose = function (event) {
        console.log("client disconnect");
        playersManager.removePlayer(client);
    };
});
httpServer.listen(55555, function () {
    console.log("Server started at http://localhost:55555");
});
// Cách chạy:
// 1. npx tsc    : biên dịch ts -> js
// 2. node .     : start server
//# sourceMappingURL=index.js.map