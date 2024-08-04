"use client";


import { Album, Song } from "@prisma/client";
import { List } from "../playlist/list";
import { LuMusic3 } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useLikedSongs } from "@/hooks/use-liked-songs";


interface LikedSongsListProps  {
    songs : ( Song & { album : Album, artists : ({ id: string, name: string, image: string })[] }  )[];
}

export const LikedSongsList = ({
    songs
} : LikedSongsListProps ) => {


    const [ songRefs, setSongRefs ] = useState(songs);
    const { songIds } = useLikedSongs();

    useEffect(()=>{

        const filteredSongs = songs.filter((song)=>songIds.includes(song.id));
        setSongRefs(filteredSongs);

    }, [songIds]);

    if (songs.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center mt-16 space-y-10">
                <div className="flex items-center justify-center">
                    <LuMusic3 className="h-10 w-10 md:h-12 md:w-12 text-white" />
                </div>
                <p className="text-xl md:text-3xl font-bold select-none" >Your liked tracks await in this spot!</p>
            </div>
        )
    }

    return (
        <div className="pt-14 pb-10">
            {
                // @ts-ignore
                <List songs={songRefs} />
            }
        </div>
    )
}
