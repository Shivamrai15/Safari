"use client";

import axios, { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { SyncLoader } from "react-spinners";
import { Lyrics } from "@prisma/client";
import { SyncedLyrics } from "./synced-lyrics";
import { UnsyncedLyrics } from "./unsynced-lyrics";


interface LyricsProps {
    songId: string;
    currentTime : number;
    active : boolean | undefined;
    seekTime : ( num:number ) => void;
}

type QueryResponse = {
    data : Lyrics|null|undefined;
    isPending : boolean;
    error : Error|null;
}

export const LyricsComponent = ({
    songId,
    active,
    currentTime,
    seekTime
}: LyricsProps) => {
    
    const { data, isPending, error } : QueryResponse = useQuery({
        queryFn : async()=>{
            const response = await axios.get(`/api/v1/lyrics?songId=${songId}`);
            return response.data;
        },
        queryKey : ['lyrics', songId],
        retry : 0,
        refetchOnWindowFocus : false,
        refetchOnReconnect : false,
        refetchOnMount : false,
    });

    if (isPending) {
        return (
            <div className="h-full flex items-center justify-center">
                <SyncLoader color="#9e9e9e" />
            </div>
        );
    }

    if (error) {
        console.error("Error fetching lyrics:", error instanceof AxiosError);
        console.error("Error fetching lyrics:", error instanceof AxiosError ? error.response : error   );
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-xl md:text-3xl font-bold text-white select-none">
                    {
                        error instanceof AxiosError && error.response?.status==404 ? "No Lyrics Found" : "Something went wrong"
                    }
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-xl md:text-3xl font-bold text-white select-none">
                    No Lyrics Found
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full">
            {
                data.synced ?
                <SyncedLyrics
                    active={active}
                    currentTime={currentTime}
                    seekTime={seekTime}
                    //@ts-ignore
                    lyrics={data.lyrics["lyrics"]}
                /> : 
                <UnsyncedLyrics
                    active={active}
                    //@ts-ignore
                    lyrics={data.lyrics["lyrics"]}
                />
            }
        </div>
    )
}