"use client";

import { useLikedSongs } from "@/hooks/use-liked-songs";
import { Album, Artist, Song } from "@prisma/client";
import { SyncLoader } from "react-spinners";
import { SongItem } from "./song-item";

export const LikedSongsList = () => {

    const { data, isLoading } : { data  : ( Song & { album : Album, artists : Artist[] } )[], isLoading : boolean } = useLikedSongs();
    
    if ( isLoading ) {
        return (
            <div className="mt-16 md:mt-20 w-full flex items-center justify-center">
                <SyncLoader color="#252525" />
            </div>
        )
    }

    return (
        <div className="md:pr-28 px-4 md:px-20 pt-14  pb-10 md:pb-20">
            {
                data.map((song)=>(
                    <SongItem key={song.id} song={song} />
                ))
            }
        </div>
    )
}
