"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIdlePlayersResponse = exports.RegisterResponse = void 0;
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
//# sourceMappingURL=DataTypes.js.map