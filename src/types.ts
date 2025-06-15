import GridSymbol from "./classes/GridSymbol";
import { z } from "zod";

type User = { username: string, token: string };

type Preferences = { 
    cols: number, 
    rows: number, 
    usernameGuest: string, 
    blocks: string, 
    soundOn: boolean
};

type MetaStats = {
    totalGames: number, totalScore: 0; totalLines: 0
};

const zodGameStats = z.object(
    {
        score: z.number(),
        lines: z.number(),
        user: z.string(),
        timesPlayed: z.number().optional(),
    }
);
type GameStats = z.infer<typeof zodGameStats>;
function isGameStats(pData : any) : pData is GameStats
{
    return zodGameStats.safeParse(pData).success;
} 
// type GameStats = {
//     score: number, lines: number, user: string, timesPlayed: number
// };

type GameButtonProps = { 
    onPress: () => any,
    symbol: GridSymbol
};

type GameButtons = {
    left: GameButtonProps;
    right: GameButtonProps;
    leftMax: GameButtonProps;
    rightMax: GameButtonProps;
    down: GameButtonProps;
    downMax: GameButtonProps;
    clockwise: GameButtonProps;
    anticlockwise: GameButtonProps;
    rotate180: GameButtonProps;
    hold: GameButtonProps;
    swapHoldWithNext : GameButtonProps;
};

const defaultGameButtonProps = { onPress: () => console.log(""), symbol: new GridSymbol() }

export { isGameStats };

export type { User, Preferences, MetaStats, GameStats, GameButtons, GameButtonProps };