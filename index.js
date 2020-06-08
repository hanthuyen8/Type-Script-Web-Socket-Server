"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageToClient = exports.NetworkRequest = void 0;
var ws_1 = __importDefault(require("ws"));
var http_1 = __importDefault(require("http"));
var PlayersManager_1 = __importDefault(require("./PlayersManager"));
var DataTypes_1 = __importDefault(require("./DataTypes"));
var NetworkRequest;
(function (NetworkRequest) {
    NetworkRequest[NetworkRequest["Register"] = 0] = "Register";
    NetworkRequest[NetworkRequest["GetIdlePlayers"] = 1] = "GetIdlePlayers";
    NetworkRequest[NetworkRequest["ChallengeOtherPlayer"] = 2] = "ChallengeOtherPlayer";
    NetworkRequest[NetworkRequest["ChallengeFromOtherPlayer"] = 3] = "ChallengeFromOtherPlayer";
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
            var sendback = true;
            var response = request;
            var responseData = null;
            console.log("Receiving: " + requestData);
            switch (request.action) {
                case NetworkRequest[NetworkRequest.Register]:
                    responseData = playersManager.newPlayer(client, request.data);
                    break;
                case NetworkRequest[NetworkRequest.GetIdlePlayers]:
                    responseData = playersManager.getIdlesPlayers();
                    break;
                case NetworkRequest[NetworkRequest.ChallengeOtherPlayer]:
                    responseData = playersManager.challengeOtherPlayer(client, request.data);
                    if (!responseData)
                        sendback = false;
                    break;
                case NetworkRequest[NetworkRequest.ChallengeFromOtherPlayer]:
                    playersManager.acceptChallenge(request.data);
                    break;
                default:
                    sendback = false;
                    break;
            }
            if (sendback && responseData) {
                response.data = responseData;
                var msg = JSON.stringify(response);
                console.log("Sending Back: " + msg);
                client.send(msg);
            }
        }
    };
    client.onclose = function (event) {
        console.log("client disconnect");
        playersManager.removePlayer(client);
    };
});
function SendMessageToClient(client, requestType, data) {
    if (client.readyState === client.OPEN) {
        var request = new DataTypes_1.default();
        request.action = NetworkRequest[requestType];
        request.data = data;
        var msg = JSON.stringify(request);
        console.log("Sending: " + msg);
        client.send(msg);
    }
}
exports.SendMessageToClient = SendMessageToClient;
httpServer.listen(55555, function () {
    console.log("Server started at http://localhost:55555");
});
// Cách chạy:
// 1. npx tsc    : biên dịch ts -> js
// 2. node .     : start server
//# sourceMappingURL=index.js.map