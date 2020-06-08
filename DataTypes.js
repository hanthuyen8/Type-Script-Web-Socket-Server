"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeFromOtherPlayerResponse = exports.ChallengeFromOtherPlayerRequest = exports.ChallengeOtherPlayerResponse = exports.ChallengeOtherPlayerRequest = exports.GetIdlePlayersResponse = exports.RegisterResponse = exports.RegisterRequest = void 0;
var BaseRequest = /** @class */ (function () {
    function BaseRequest() {
        this.action = "";
        this.data = "";
    }
    return BaseRequest;
}());
exports.default = BaseRequest;
//#region Register Data
var RegisterRequest = /** @class */ (function () {
    function RegisterRequest() {
        this.nickName = "";
    }
    Object.defineProperty(RegisterRequest.prototype, "isInvalid", {
        get: function () {
            if (!this.nickName || this.nickName.length == 0)
                return false;
            return true;
        },
        enumerable: false,
        configurable: true
    });
    return RegisterRequest;
}());
exports.RegisterRequest = RegisterRequest;
var RegisterResponse = /** @class */ (function () {
    function RegisterResponse(success, message) {
        this.message = message;
        this.success = success;
    }
    return RegisterResponse;
}());
exports.RegisterResponse = RegisterResponse;
//#endregion
//#region  Get Idle Player Data
var GetIdlePlayersResponse = /** @class */ (function () {
    function GetIdlePlayersResponse() {
        this.playerNames = [];
    }
    return GetIdlePlayersResponse;
}());
exports.GetIdlePlayersResponse = GetIdlePlayersResponse;
//#endregion
//#region Game Data
var ChallengeOtherPlayerRequest = /** @class */ (function () {
    function ChallengeOtherPlayerRequest() {
        this.otherPlayerName = "";
    }
    return ChallengeOtherPlayerRequest;
}());
exports.ChallengeOtherPlayerRequest = ChallengeOtherPlayerRequest;
var ChallengeOtherPlayerResponse = /** @class */ (function () {
    function ChallengeOtherPlayerResponse() {
        this.success = false;
        this.message = "";
    }
    return ChallengeOtherPlayerResponse;
}());
exports.ChallengeOtherPlayerResponse = ChallengeOtherPlayerResponse;
var ChallengeFromOtherPlayerRequest = /** @class */ (function () {
    function ChallengeFromOtherPlayerRequest() {
        this.challenger = "";
        this.challengeId = "";
    }
    return ChallengeFromOtherPlayerRequest;
}());
exports.ChallengeFromOtherPlayerRequest = ChallengeFromOtherPlayerRequest;
var ChallengeFromOtherPlayerResponse = /** @class */ (function () {
    function ChallengeFromOtherPlayerResponse() {
        this.accept = false;
        this.challengeId = "";
    }
    return ChallengeFromOtherPlayerResponse;
}());
exports.ChallengeFromOtherPlayerResponse = ChallengeFromOtherPlayerResponse;
//#endregion
//# sourceMappingURL=DataTypes.js.map