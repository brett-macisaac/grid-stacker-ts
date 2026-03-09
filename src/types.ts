import GridSymbol from "@/classes/GridSymbol";
import { z } from "zod";

const zodUser = z.object(
    {
        username: z.string(),
        token: z.string()
    }
);
export type User = z.infer<typeof zodUser>;
export function isUser(pAny : any) : pAny is User
{
    return zodUser.safeParse(pAny).success;
}

export const zodBlockAction = z.enum(["left", "right", "down", "clockwise", "antiClockwise", "oneEighty", "impactWall", "impactBlocks", "switchBlock", "clearBlock"]);
export type BlockAction = z.infer<typeof zodBlockAction>;
export function isBlockAction(pAny : any) : pAny is BlockAction
{
    return zodBlockAction.safeParse(pAny).success;
}

/**
 * The direction that the blocks move:
 * - fall: blocks fall downwards, 
 * - rise: means the blocks rise upwards
 * - alternate: means the blocks alternate between falling and rising. The direction changes whenever the grid is 
 *   completely cleared.
 */
const zodBlockDirection = z.enum(["fall", "rise", "alternate"]);
export type BlockDirection = z.infer<typeof zodBlockDirection>;
export function isBlockDirection(pAny : any) : pAny is BlockDirection
{
    return zodBlockDirection.safeParse(pAny).success;
}

// Sound name + file path.
const zodSound = z.object(
    {
        name: z.string(),
        file: z.string()
    }
);
export type Sound = z.infer<typeof zodSound>;

const zodBlockSoundsByAction = z.object(
    {
        name: z.string(),
        blockActionToSound: z.record(
            zodBlockAction,
            zodSound
        )
    }
);
export type BlockSoundsByAction = z.infer<typeof zodBlockSoundsByAction>;
export function isBlockSoundsByAction(pAny : any) : pAny is BlockSoundsByAction
{
    return zodBlockSoundsByAction.safeParse(pAny).success;
}

const zodBlockSoundsRandom = z.object(
    {
        name: z.string(),
        sounds: z.array(zodSound)
    }
);
export type BlockSoundsRandom = z.infer<typeof zodBlockSoundsRandom>;
export function isBlockSoundsRandom(pAny : any) : pAny is BlockSoundsRandom
{
    return zodBlockSoundsRandom.safeParse(pAny).success;
}

const zodBlockSoundsUnion = z.union([zodBlockSoundsByAction, zodBlockSoundsRandom]);
export type BlockSounds = z.infer<typeof zodBlockSoundsUnion>;

const zodPreferences = z.object(
    {
        cols: z.number(),
        rows: z.number(),
        usernameGuest: z.string(),
        blocks: z.string(),
        soundOn: z.boolean(),
        sounds: zodBlockSoundsUnion,
        blockDirection: zodBlockDirection
    }
);
export type Preferences = z.infer<typeof zodPreferences>;
export function isPreferences(pAny : any) : pAny is Preferences
{
    return zodPreferences.safeParse(pAny).success;
}

const zodMetaStats = z.object(
    {
        totalGames: z.number(),
        totalScore: z.number(),
        totalLines: z.number()
    }
);
export type MetaStats = z.infer<typeof zodMetaStats>;
export function isMetaStats(pAny : any) : pAny is MetaStats
{
    return zodMetaStats.safeParse(pAny).success;
}

const zodGameStats = z.object(
    {
        score: z.number(),
        lines: z.number(),
        user: z.string(),
        timesPlayed: z.number().optional(),
    }
);
export type GameStats = z.infer<typeof zodGameStats>;
export function isGameStats(pData : any) : pData is GameStats
{
    return zodGameStats.safeParse(pData).success;
} 

export type GameButtonProps = { 
    onPress: () => any,
    symbol: GridSymbol
};

export type GameButtons = {
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