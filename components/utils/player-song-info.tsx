"use client";

import { Album, Song } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface PlayerSongInfo {
    song : (Song & {
        album : Album,
    }) | null ;
}

export const PlayerSongInfo = ({
    song
} : PlayerSongInfo ) => {
    
    if (!song) {
        return null;
    }

    return (
        <div className="h-full w-full flex items-center gap-4">
            <div className="relative aspect-square h-full rounded-sm overflow-hidden">
                <Image
                    src={song.image}
                    alt={song.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="w-full flex-1 space-y-0 select-none">
                <h3 className="line-clamp-1 font-medium text-sm md:text-base py-0 my-0">{song.name}</h3>
                <Link href={`/album/${song.albumId}`} onClick={(e)=>e.stopPropagation()} className="text-xs md:text-sm py-0 my-0 text-zinc-200 hover:underline" >{song.album.name}</Link>
            </div>
        </div>
    )
}
