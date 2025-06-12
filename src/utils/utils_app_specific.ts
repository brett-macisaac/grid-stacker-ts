import { utils } from "../standard_ui/standard_ui";
import { TableData } from "../components/table_std/TableStd";
import { GameStats } from "../types";

function getTableDataHighScores(pGameStatsGlobal?: GameStats, pGameStatsLocal?: GameStats) : TableData
{
    function numToStr(pNum : number) : string
    {
        return pNum >= 0 ? utils.intToCommaSeparatedString(pNum) : "-";
    }

    return {
        orderColumns: [ "title", "score", "lines", "user" ],
        header: new Map<string, string>([ [ "title", "RECORD" ], [ "score", "SCORE" ], [ "lines", "LINES" ], [ "user", "USER"] ]),
        content:
        {
            orderRows: [ "highScoreGlobal", "highScoreLocal" ],
            rows: new Map<string, Map<string, string>>(
                [
                    [ 
                        "highScoreGlobal", 
                        new Map<string, string>([ 
                            [ "title", "Global" ], [ "score", numToStr(pGameStatsGlobal?.score || -1) ], 
                            [ "lines", numToStr(pGameStatsGlobal?.lines || -1) ], 
                            [ "user", pGameStatsGlobal?.user ? pGameStatsGlobal.user : "-" ] 
                        ]) 
                    ],
                    [ 
                        "highScoreLocal", 
                        new Map<string, string>([ 
                            [ "title", "Local" ], [ "score", numToStr(pGameStatsLocal?.score || -1) ], 
                            [ "lines", numToStr(pGameStatsLocal?.lines || -1) ], 
                            [ "user",  pGameStatsLocal?.user ? pGameStatsLocal.user : "-" ] 
                        ]) 
                    ],
                ]
            )
        }
    }
}

export { getTableDataHighScores };