import React, { createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import utils from '../standard_ui/utils.ts';
import { Preferences } from "../types.ts";

interface ValuePrefContext
{ 
    prefs: Preferences, 
    update: (pCols?: number, pRows?: number, pUsernameGuest?: string, 
             pBlocks?: string, pSoundOn?: boolean) => void,
}

const gPrefsDefault : Preferences = { cols: 4, rows: 9, usernameGuest: "", blocks: "IJLOSTZ", soundOn: true };

const PrefContext = createContext<ValuePrefContext>(
    { 
        prefs: gPrefsDefault, 
        update: (pCols?: number, pRows?: number, pUsernameGuest?: string, 
                 pBlocks?: string, pSoundOn?: boolean) => { console.log("PrefContext: Empty update function. Is the component a child of PrefProvider?"); }, 
    }
);

/*
* A localStorage key whose value is a string that corresponding to the current stored user..
*/
const gLclStrgKeyPrefs : string = "GameSettings";

interface PropsPrefProvider
{
    children: React.ReactNode
}

function PrefProvider({ children } : PropsPrefProvider) 
{
    /* The name of the current theme. */
    const [ stPrefs, setPrefs ] = useState<Preferences>(utils.getFromLocalStorage(gLclStrgKeyPrefs) ?? gPrefsDefault);

    /**
    * Changes the user's (device's) preferences.
    */
    const update = useCallback(
        (pCols?: number, pRows?: number, pUsernameGuest?: string, 
         pBlocks?: string, pSoundOn?: boolean) : void =>
        {
            setPrefs(
                (prev : Preferences) =>
                {
                    const lPrefsNew : Preferences = {
                        cols: pCols ? pCols : prev.cols,
                        rows: pRows ? pRows : prev.rows,
                        usernameGuest: pUsernameGuest ? pUsernameGuest : prev.usernameGuest,
                        blocks: pBlocks ? pBlocks : prev.blocks,
                        soundOn: pSoundOn != undefined ? pSoundOn : prev.soundOn,
                    }

                    utils.setInLocalStorage<Preferences>(gLclStrgKeyPrefs, lPrefsNew);

                    return lPrefsNew;
                }
            );

            // const lPrefsNew : Preferences = {
            //     cols: pCols ? pCols : stPrefs.cols,
            //     rows: pRows ? pRows : stPrefs.rows,
            //     usernameGuest: pUsernameGuest ? pUsernameGuest : stPrefs.usernameGuest,
            //     blocks: pBlocks ? pBlocks : stPrefs.blocks,
            //     soundOn: pSoundOn ? pSoundOn : stPrefs.soundOn,
            // };

            // utils.setInLocalStorage<Preferences>(gLclStrgKeyPrefs, lPrefsNew);

            // setPrefs(lPrefsNew);
        },
        []
    );

    const lValue = useMemo<ValuePrefContext>(
        () =>
        {
            return { 
                prefs: stPrefs, update: update
            }
        },
        [ stPrefs, update ]
    );

    return (
        <PrefContext.Provider 
            value = { lValue }
        >
            { children }
        </PrefContext.Provider>
    );
}

function usePrefs() 
{
    return useContext(PrefContext);
}

export { PrefProvider as default, usePrefs };

export type { ValuePrefContext };