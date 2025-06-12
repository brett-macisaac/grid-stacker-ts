import { MetaStats } from "../types";
import { utils } from "../standard_ui/standard_ui";
import ApiRequestor from "../ApiRequestor";

const gMetaStatsDefault : MetaStats = { totalGames: 0, totalScore: 0, totalLines: 0 };

const gLclStrgKeyMetaStats : string = "metaStatsLocal";

class MetaStatsManager
{
    static #sMetaStatsGlobal : MetaStats | undefined;

    static #sMetaStatsLocal : MetaStats | undefined;

    static getMetaStatsLocal() : MetaStats
    {
        if (!MetaStatsManager.#sMetaStatsLocal)
        {
            MetaStatsManager.#sMetaStatsLocal = utils.getFromLocalStorage<MetaStats>(gLclStrgKeyMetaStats) || gMetaStatsDefault;
        }

        return MetaStatsManager.#sMetaStatsLocal;
    }

    static async getMetaStatsGlobal(pReload: boolean = false) : Promise<MetaStats>
    {
        if (!MetaStatsManager.#sMetaStatsGlobal || pReload)
        {
            MetaStatsManager.#sMetaStatsGlobal = await ApiRequestor.getMetaStats() || gMetaStatsDefault;
        }

        return MetaStatsManager.#sMetaStatsGlobal;
    }

    static updateMetaStatsLocal(pScore : number, pLines : number) : void
    {
        const lMetaStatsLocal : MetaStats = MetaStatsManager.getMetaStatsLocal();

        lMetaStatsLocal.totalGames += 1;
        lMetaStatsLocal.totalLines += pLines;
        lMetaStatsLocal.totalScore += pScore;

        utils.setInLocalStorage<MetaStats>(gLclStrgKeyMetaStats, lMetaStatsLocal);

        MetaStatsManager.#sMetaStatsLocal = lMetaStatsLocal;
    }

    static getDefaultMetaStats() : MetaStats
    {
        return gMetaStatsDefault;
    }
}

export default MetaStatsManager;