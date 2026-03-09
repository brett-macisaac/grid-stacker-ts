import React, { createContext, useContext, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import utils from '@/standard_ui/utils';
import { BlockDirection, isPreferences, Preferences } from "@/types";
import { blockSoundsDefault } from '@/utils/sounds';

interface ValuePrefContext
{ 
    prefs: Preferences, 
    update: (pPrefs: Partial<Preferences>) => void,
}

const gPrefsDefault : Preferences = { 
    cols: 4, 
    rows: 9, 
    usernameGuest: "", 
    blocks: "IJLOSTZ", 
    soundOn: true, 
    sounds: blockSoundsDefault,
    blockDirection: "fall" 
};

const PrefContext = createContext<ValuePrefContext>(
    { 
        prefs: gPrefsDefault, 
        update: (pPrefs: Partial<Preferences>) => { console.log("PrefContext: Empty update function. Is the component a child of PrefProvider?"); }, 
    }
);

/*
* A localStorage key whose value is a string that corresponding to the current stored preferences.
*/
const gLclStrgKeyPrefs : string = "GameSettings";

interface PropsPrefProvider
{
    children: React.ReactNode
}

function PrefProvider({ children } : PropsPrefProvider) 
{
    /* The user's preferences. */
    const [ stPrefs, setPrefs ] = useState<Preferences>(
        utils.getFromLocalStorageTyped<Preferences>(gLclStrgKeyPrefs, isPreferences) || gPrefsDefault
    );

    /**
    * Changes the user's (device's) preferences.
    */
    const update = useCallback(
        (pPrefs: Partial<Preferences>) : void =>
        {
            setPrefs(
                (prev : Preferences) =>
                {
                    const lPrefsNew : Preferences = {
                        cols: pPrefs.cols ? pPrefs.cols : prev.cols,
                        rows: pPrefs.rows ? pPrefs.rows : prev.rows,
                        usernameGuest: pPrefs.usernameGuest ? pPrefs.usernameGuest : prev.usernameGuest,
                        blocks: pPrefs.blocks ? pPrefs.blocks : prev.blocks,
                        soundOn: pPrefs.soundOn != undefined ? pPrefs.soundOn : prev.soundOn,
                        blockDirection: pPrefs.blockDirection ? pPrefs.blockDirection : prev.blockDirection,
                        sounds: pPrefs.sounds ? pPrefs.sounds : prev.sounds,
                    };

                    utils.setInLocalStorage(gLclStrgKeyPrefs, lPrefsNew);

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