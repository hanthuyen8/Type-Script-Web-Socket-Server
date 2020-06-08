"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Challenge = exports.Player = exports.PlayerStatus = void 0;
var DataTypes_1 = require("./DataTypes");
var _1 = require(".");
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["Idle"] = 0] = "Idle";
    PlayerStatus[PlayerStatus["InMatch"] = 1] = "InMatch";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
var PlayersManager = /** @class */ (function () {
    function PlayersManager() {
        this.players = [];
        this.challenge = new Challenge();
    }
    /**
     * Tạo mới 1 Player và set nickName cho player này
     * @returns return về Player đó hoặc null nếu RegisterData không hợp lệ */
    PlayersManager.prototype.newPlayer = function (id, registerData) {
        var failure = JSON.stringify(new DataTypes_1.RegisterResponse(false, "Yêu cầu không hợp lệ."));
        if (!registerData || registerData.length === 0)
            return failure;
        var data = JSON.parse(registerData);
        if (data.isInvalid)
            return failure;
        var player = this.players.find(function (x) { return x.nickName === data.nickName; });
        if (!player) {
            player = new Player(id, data.nickName);
            this.players.push(player);
            return JSON.stringify(new DataTypes_1.RegisterResponse(true, "Register Successful"));
        }
        return JSON.stringify(new DataTypes_1.RegisterResponse(false, "This Nick Name Is Already In Use."));
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
    PlayersManager.prototype.challengeOtherPlayer = function (senderId, requestData) {
        var result = new DataTypes_1.ChallengeOtherPlayerResponse();
        result.success = false;
        result.message = "Yêu cầu không hợp lệ";
        var failResponse = JSON.stringify(result);
        if (!requestData || requestData.length === 0) {
            return failResponse;
        }
        var data = JSON.parse(requestData);
        if (!data || data.otherPlayerName.length === 0)
            return failResponse;
        var challenger = this.players.find(function (x) { return x.id === senderId; });
        var other = this.players.find(function (x) { return x.nickName === data.otherPlayerName; });
        if (!challenger || !other)
            return failResponse;
        if (other.status === PlayerStatus.InMatch) {
            result.message = "Ng\u01B0\u1EDDi ch\u01A1i: " + other.nickName + " \u0111ang trong tr\u1EADn.";
            return JSON.stringify(result);
        }
        this.challenge.newChallenge(challenger, other);
        return null;
    };
    PlayersManager.prototype.acceptChallenge = function (requestData) {
        var data = JSON.parse(requestData);
        if (data) {
            this.challenge.acceptChallenge(data.challengeId, data.accept);
        }
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
var Challenge = /** @class */ (function () {
    function Challenge() {
        // Cách thức hoạt động
        // 1. playerA gửi message lên cho server muốn challenge playerB
        // 2. server kiểm tra hợp lệ rồi lưu playerA vào danh sách challenge với đối thủ là playerB
        // 3. server gửi message cho playerB rằng playerA muốn challenge
        // 4. playerB gửi trả message cho server
        // 5. Nếu playerB đồng ý thì server gửi message start game cho cả 2
        // 6. Nếu playerB không đồng ý thì server gửi message thông báo cho playerA
        this.challenges = new Map;
    }
    Challenge.prototype.newChallenge = function (challenger, other) {
        var challengeId = challenger.nickName + other.nickName;
        if (!this.challenges.has(challengeId)) {
            var data = new ChallengeData(challenger, other);
            this.challenges.set(challengeId, data);
            var challengeRequest = new DataTypes_1.ChallengeFromOtherPlayerRequest();
            challengeRequest.challengeId = challengeId;
            challengeRequest.challenger = challenger.nickName;
            _1.SendMessageToClient(other.id, _1.NetworkRequest.ChallengeFromOtherPlayer, JSON.stringify(challengeRequest));
        }
    };
    Challenge.prototype.acceptChallenge = function (challengeId, accept) {
        var data = this.challenges.get(challengeId);
        if (data) {
            if (accept) {
                // start game ở cả 2 client
            }
            else {
                var challengeResponse = new DataTypes_1.ChallengeOtherPlayerResponse();
                challengeResponse.message = "Ng\u01B0\u1EDDi ch\u01A1i: " + data.other.nickName + " kh\u00F4ng \u0111\u1ED3ng \u00FD th\u00E1ch \u0111\u1EA5u.";
                challengeResponse.success = false;
                _1.SendMessageToClient(data.challenger.id, _1.NetworkRequest.ChallengeOtherPlayer, JSON.stringify(challengeResponse));
            }
            this.challenges.delete(challengeId);
        }
    };
    return Challenge;
}());
exports.Challenge = Challenge;
var ChallengeData = /** @class */ (function () {
    function ChallengeData(challenger, other) {
        this.challenger = challenger;
        this.other = other;
    }
    return ChallengeData;
}());
//# sourceMappingURL=PlayersManager.js.map