"use client";

import axios from "axios";
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
    });

    if (isPending) {
        return (
            <div className="h-full flex items-center justify-center">
                <SyncLoader color="#9e9e9e" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-xl md:text-3xl font-bold text-white select-none">
                    Something went wrong
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