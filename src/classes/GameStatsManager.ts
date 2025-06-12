import ApiRequestor, { UpdateGameStatsObject } from "../ApiRequestor";
import utils from "../standard_ui/utils";
import { GameStats, MetaStats } from "../types";
import Grid from "./Grid";

const gLclStrgKeyGameStatsKeys : string = "GameStatsArray";

class GameStatsManager
{
    static #sDataLocal : Map<string, GameStats> = new Map<string, GameStats>();

    static #sDataGlobal : Map<string, GameStats> = new Map<string, GameStats>();

    static #sGameStatsKeys : Set<string> = new Set<string>();

    static #sIsLoadedGameStatsKeys : boolean = false;

    // constructor(pGameStatsColl : Map<string, Map<string, GameStats>> | undefined)
    // {
    //     this.#fGameStatsColl = pGameStatsColl ? pGameStatsColl : new Map<string, Map<string, GameStats>>();
    // }

    static initialiseKeys()
    {
        // Initialise the array of keys.
        if (!GameStatsManager.#sIsLoadedGameStatsKeys)
        {
            GameStatsManager.#sGameStatsKeys = new Set(utils.getFromLocalStorage<string[]>(gLclStrgKeyGameStatsKeys) || []);

            GameStatsManager.#sIsLoadedGameStatsKeys = true;
        }
    }

    static getAllStatsLocal() : Map<string, GameStats>
    {
        GameStatsManager.initialiseKeys();

        for (const key of GameStatsManager.#sGameStatsKeys.values()) 
        {
            if (!GameStatsManager.#sDataLocal.has(key))
            {
                const lGameStats : GameStats | undefined = GameStatsManager.getGameStatsFromKey(key);

                if (lGameStats)
                {
                    GameStatsManager.#sDataLocal.set(key, lGameStats);
                }
            }
        }

        return GameStatsManager.#sDataLocal;
    }

    static getKeyGameStats(pBlockList : string, pGridSize : string) : string
    {
        return `${pBlockList}-${pGridSize}`
    }

    static getGameStatsFromKey(pKey : string) : GameStats | undefined
    {
        if (GameStatsManager.#sDataLocal.has(pKey))
            return GameStatsManager.#sDataLocal.get(pKey);

        const lStats : GameStats | undefined = utils.getFromLocalStorage(pKey);

        if (lStats)
        {
            GameStatsManager.#sDataLocal.set(pKey, lStats);
        }

        return lStats;
    }

    static getStatsLocal(pBlockList : string, pGridSize : string) : GameStats | undefined
    {
        const lKey : string = GameStatsManager.getKeyGameStats(pBlockList, pGridSize);

        return GameStatsManager.getGameStatsFromKey(lKey);
    }

    static async getStatsGlobal(pBlockList : string, pGridSize : string, pUseCacheIfAvailable : boolean = true) : Promise<GameStats | undefined>
    {
        let lStats : GameStats | undefined = undefined;

        const lKey : string = GameStatsManager.getKeyGameStats(pBlockList, pGridSize);

        if (pUseCacheIfAvailable)
        {
            lStats = GameStatsManager.#sDataGlobal.get(lKey);

            if (lStats)
                return lStats;
        }

        lStats = await ApiRequestor.getGameStats(pBlockList, pGridSize);

        if (lStats)
        {
            GameStatsManager.#sDataGlobal.set(lKey, lStats);
        }

        return lStats;
    }

    static async updateStatsGlobal(pBlockList : string, pGridSize : string, pScore : number, pLines : number, pUser : string) : Promise<GameStats | undefined>
    {
        // Update global stats.
        const lUpdateResponse : GameStats | undefined = await ApiRequestor.updateStats(
            {
                "blocks": pBlockList,
                "grid": pGridSize,
                "score": pScore,
                "lines": pLines,
                "user": pUser
            }
        );

        if (lUpdateResponse)
        {
            GameStatsManager.#sDataGlobal.set(GameStatsManager.getKeyGameStats(pBlockList, pGridSize), lUpdateResponse);
        }

        return lUpdateResponse;
    }

    static updateStatsLocal(pBlockList : string, pGridSize : string, pScore : number, pLines : number, pUser : string) : GameStats
    {
        GameStatsManager.initialiseKeys();

        const lKey : string = GameStatsManager.getKeyGameStats(pBlockList, pGridSize);

        let lGameStats : GameStats | undefined = GameStatsManager.getGameStatsFromKey(lKey) || GameStatsManager.getDefaultGameStats();

        if (pScore > lGameStats.score)
        {
            lGameStats.lines = pLines;
            lGameStats.score = pScore;
            lGameStats.user = pUser;
        }

        if (!lGameStats.timesPlayed)
            lGameStats.timesPlayed = 0;

        lGameStats.timesPlayed += 1;

        GameStatsManager.#sDataLocal.set(lKey, lGameStats);

        // Store the stats locally.
        utils.setInLocalStorage(lKey, lGameStats);

        // Update the game stats keys, which allows the program to know which game stats objects exist in local storage.
        if (!GameStatsManager.#sGameStatsKeys.has(lKey))
        {
            GameStatsManager.#sGameStatsKeys.add(lKey);
        }
        utils.setInLocalStorage(gLclStrgKeyGameStatsKeys, Array.from(GameStatsManager.#sGameStatsKeys.values()))

        return lGameStats;
    }

    static getDefaultGameStats() : GameStats
    {
        return { score: 0, lines: 0, user: "", timesPlayed: 0 };
    }
}

export default GameStatsManager;