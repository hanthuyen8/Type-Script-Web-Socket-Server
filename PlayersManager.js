"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.PlayerStatus = void 0;
var DataTypes_1 = require("./DataTypes");
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["Idle"] = 0] = "Idle";
    PlayerStatus[PlayerStatus["InMatch"] = 1] = "InMatch";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
var PlayersManager = /** @class */ (function () {
    function PlayersManager() {
        this.players = [];
    }
    /**
     * Tạo mới 1 Player và set nickName cho player này
     * @returns return về Player đó hoặc null nếu RegisterData không hợp lệ */
    PlayersManager.prototype.newPlayer = function (id, registerData) {
        if (!registerData || registerData.length === 0) {
            return JSON.stringify(new DataTypes_1.RegisterResponse(false, "Invalid Register Data"));
        }
        var data = JSON.parse(registerData);
        if (data && data.nickName) {
            var player = this.players.find(function (x) { return x.nickName === data.nickName; });
            if (!player) {
                player = new Player(id, data.nickName);
                this.players.push(player);
                return JSON.stringify(new DataTypes_1.RegisterResponse(true, "Register Successful"));
            }
            return JSON.stringify(new DataTypes_1.RegisterResponse(true, "This Nick Name Is Already In Use."));
        }
        return JSON.stringify(new DataTypes_1.RegisterResponse(false, "Invalid Register Data"));
    };
    /** Xóa Player */
    PlayersManager.prototype.removePlayer = function (id) {
        var index = this.players.findIndex(function (x) { return x.id === id; });
        if (index > 0)
            this.players.splice(index, 1);
    };
    /** Lấy ra danh sách tất cả các Player nào đang Idle */
    PlayersManager.prototype.getIdlesPlayers = function () {
        var result = new DataTypes_1.GetIdlePlayersResponse();
        var list = result.playerNames;
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var p = _a[_i];
            if (p.status === PlayerStatus.Idle)
                list.push(p.nickName);
        }
        return JSON.stringify(result);
    };
    return PlayersManager;
}());
exports.default = PlayersManager;
var Player = /** @class */ (function () {
    function Player(id, nickName) {
        this.id = id;
        this.nickName = nickName;
        this.status = PlayerStatus.Idle;
    }
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=PlayersManager.js.map