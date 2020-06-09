import { MatchData, Player } from "./DataTypes";

export default class Game
{
    private static matches: Map<Player, MatchData> = new Map();

    public static newMatch(playerA: Player, playerB: Player) : MatchData
    {
        let game = new MatchData(playerA, playerB);
        this.matches.set(playerA, game);
        this.matches.set(playerB, game);

        return game;
    }
}