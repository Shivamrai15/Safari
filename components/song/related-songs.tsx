"use client";

import { Song } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import { SongCard } from "./song-card";

interface RelatedSongsProps {
    songId: string;
}

type Response = {
    data : Song[]|undefined;
    error : Error|null;
    isPending : boolean;
}

export const RelatedSongs = ({
    songId
}: RelatedSongsProps) => {

    const { data, error, isPending } : Response  = useQuery({
        queryFn : async()=>{
            const response = await axios.get(`/api/v1/song/recommendations?id=${songId}`);
            return response.data;
        },
        queryKey : [songId, "related-songs"],
    });

    return (
        <div className="bg-neutral-800 flex flex-col flex-1 w-full rounded-2xl overflow-hidden py-4 gap-y-4 ring-1 ring-neutral-700/60">
            <div className="h-full w-full relative overflow-y-auto lyrics-scrollbar">
                <h1 className="px-4 sticky top-0 md:text-lg font-semibold pb-4 z-10 bg-gradient-to-b from-neutral-800 via-neutral-800 to-transparent select-none">Related Songs</h1>
                <ul className="px-4 flex-1 flex flex-col gap-y-2 w-full">
                {
                        (error || isPending || (!data)) ? (
                            <div className="flex items-center justify-center py-4">
                                <SyncLoader color="#9e9e9e" />
                            </div>
                        ) : (
                            data.map((song)=>(
                                <SongCard
                                    song={song}
                                    key={song.id}
                                    className="bg-neutral-800 hover:bg-neutral-700/80 w-auto"
                                /> 
                            ))
                        )
                    }
                </ul>
            </div>
        </div>
    )
}
