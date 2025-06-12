import axios, { AxiosInstance } from "axios";

import { User, MetaStats, GameStats, isGameStats } from "./types";

import { z } from "zod";

const gTesting : boolean = false;

const gBaseURL : string = gTesting ? "http://localhost:5000/api/v1/" : "https://grid-stacker-api.onrender.com/api/v1/";

type ResponseGeneral = {
    success: boolean,
    content: { 
        title: string, 
        message: string 
    }
};

// User API return type.
const zodResponseUser = z.object(
    {
        username: z.string(),
        token: z.string()
    }
);
type ResponseUser = z.infer<typeof zodResponseUser>;
function isResponseUser(pAny : any) : pAny is ResponseUser
{
    return zodResponseUser.safeParse(pAny).success;
    // return ("username" in pAny && typeof pAny.username === 'string') && ("token" in pAny && typeof pAny.token === 'string');
}

// Error API return type.
const zodResponseError = z.object(
    {
        error: z.object(
            {
                title: z.string(),
                message: z.string()
            }
        ),
    }
);
type ResponseError = z.infer<typeof zodResponseError>
function isResponseError(pAny : any) : pAny is ResponseError
{
    return zodResponseError.safeParse(pAny).success;
}

type UpdateGameStatsObject =
{
    blocks: string,
    grid: string,
    score: number,
    lines: number,
    user: string
};

class ApiRequestor
{
    static sAxiosGS : AxiosInstance = axios.create(
        {
            baseURL: `${gBaseURL}grid_stacker`,
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 5000,
            validateStatus: () => true
        }
    );

    static sAxiosUser : AxiosInstance = axios.create(
        {
            baseURL: `${gBaseURL}user`,
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 5000,
            validateStatus: () => true
        }
    );

    static sAuthToken : string = "";

    static setAuthToken(pToken : string) : void
    {
        ApiRequestor.sAuthToken = pToken;
        //ApiRequestor.sAxiosGS.defaults.headers.common['Authorization'] = `Bearer ${pToken}`;
    }

    static async getMetaStats() : Promise<MetaStats | undefined>
    {
        try
        {
            const lResponse = await ApiRequestor.sAxiosGS.get<MetaStats>(`/metaStats`);

            //console.log(lResponse);

            return lResponse.data;
        }
        catch(e)
        {
            //console.log(e.stack);
            return undefined;
        }
    }

    static async getGameStats(pBlockList : string, pGridSize : string) : Promise<GameStats | undefined>
    {
        try
        {
            const lResponse = await ApiRequestor.sAxiosGS.get<GameStats>("/getGameStats", { params: { blocks: pBlockList, grid: pGridSize } });

            if (isGameStats(lResponse.data))
            {
                return lResponse.data;
            }

            return undefined;
        }
        catch(e)
        {
            //console.log(e.stack);
            return undefined;
        }
    }

    static async updateStats(pData : UpdateGameStatsObject) : Promise<GameStats | undefined>
    {
        try
        {
            const lResponse = await ApiRequestor.sAxiosGS.put(
                `/private/updateStats`,
                pData,
                {
                    headers:
                    {
                        authorization: `Bearer ${ApiRequestor.sAuthToken}`
                    }
                }
            );

            if (isGameStats(lResponse.data))
            {
                return lResponse.data;
            }

            return undefined;
        }
        catch(e)
        {
            //console.log(e.stack);
            return undefined;
        }
    }

    // todo: the backend can also return an error like '{ error: string }', which should be changed.
    // In general, if something goes wrong, the response should be a ResponseGeneral with the 'success' flag set to false.
    // Essentially copy the system used in the AgView app, if possible.
    static async signIn(pUsername : string, pPassword : string, pCreateAccount : boolean = false) : Promise<ResponseError | ResponseUser | undefined>
    {
        try
        {
            // The data to send with the request.
            const lDetails = { username: pUsername, password: pPassword };

            // Send request.
            const lResponse = await ApiRequestor.sAxiosUser.post(
                !pCreateAccount ? "/login" : "/signup",
                lDetails
            );

            // Validate request.
            if (isResponseUser(lResponse.data) || isResponseError(lResponse.data))
            {
                return lResponse.data;
            }
            else
            {
                // todo: log error.

                return undefined;
            }
        }
        catch (e)
        {
            //console.log(e.stack);
            return undefined;
        }
    }

};

export { ApiRequestor as default, isResponseError, isResponseUser };

export type { UpdateGameStatsObject, ResponseGeneral, ResponseUser, ResponseError };