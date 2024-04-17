"use client";
import { cn } from '@/lib/utils';
import { Album, Artist, Song } from '@prisma/client';
import { FaPlay } from 'react-icons/fa';

interface SongPlayButton {
    songs? : (Song & {
        album : Album,
        artists : Artist[]
    })[]
    id : string;
    className? : string
}

export const SongPlayButton = ({
    songs,
    id,
    className
} : SongPlayButton ) => {
    return (
        <button className={cn(
            "rounded-full bg-red-600 flex items-center justify-center h-12 w-12 hover:scale-105 transition-all duration-150",
            className
        )}>
            <FaPlay/>
        </button>
    )
}
