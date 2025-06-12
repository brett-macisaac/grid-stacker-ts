import React, { createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import utils from '../standard_ui/utils.ts';
import { User } from "../types";
import ApiRequestor from '../ApiRequestor';

interface ValueUserContext
{ 
    user: User | undefined, 
    update: (pUser?: User) => void,
}

const UserContext = createContext<ValueUserContext>(
    { 
        user: undefined, 
        update: (pUser?: User) => { console.log("UserContext: Empty update function. Is the component a child of UserProvider?"); }, 
    }
);

/*
* A localStorage key whose value is a string that corresponding to the current stored user..
*/
const gLclStrgKeyUser : string = "UserSaved";

interface PropsUserProvider
{
    children: React.ReactNode
}

function UserProvider({ children } : PropsUserProvider) 
{
    /* The name of the current theme. */
    const [ stUser, setUser ] = useState<User | undefined>(utils.getFromLocalStorage(gLclStrgKeyUser) ?? undefined);

    /**
    * Swithes user.
    */
    const update = useCallback(
        (pUser?: User) : void =>
        {
            if (!pUser)
            {
                setUser(undefined);
                localStorage.removeItem(gLclStrgKeyUser);
                return;
            }

            setUser(pUser);

            utils.setInLocalStorage(gLclStrgKeyUser, pUser);
        },
        []
    );

    const lValue = useMemo<ValueUserContext>(
        () =>
        {
            // Update the token.
            ApiRequestor.setAuthToken(stUser ? stUser.token : "");

            return { 
                user: stUser, update: update
            }
        },
        [ stUser, update ]
    );

    return (
        <UserContext.Provider 
            value = { lValue }
        >
            { children }
        </UserContext.Provider>
    );
}

function useUser() 
{
    return useContext(UserContext);
}

export { UserProvider as default, useUser };

export type { ValueUserContext };