"use client";

import { useLikedSongs } from "@/hooks/use-liked-songs";
import { Album, Artist, Song } from "@prisma/client";
import { SyncLoader } from "react-spinners";
import { List } from "../playlist/list";
import { LuMusic3 } from "react-icons/lu";

export const LikedSongsList = () => {

    const { data, isLoading } : { data  : ( Song & { album : Album, artists : Artist[] } )[], isLoading : boolean } = useLikedSongs();
    
    if ( isLoading ) {
        return (
            <div className="mt-16 md:mt-20 w-full flex items-center justify-center">
                <SyncLoader color="#252525" />
            </div>
        )
    }

    if (data.length === 0) {
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
            <List  songs={data} />
        </div>
    )
}
