"use client";

import { useEffect, useState } from "react";
import { usePlayer } from "@/hooks/use-player";
import { useQueue } from "@/hooks/use-queue";
import { Song , Album} from "@prisma/client"
import { FaPause, FaPlay } from "react-icons/fa";

interface PlayButtonProps {
    songs : (Song & { album : Album })[]
}

export const PlayButton = ({
    songs
} : PlayButtonProps ) => {

    const { priorityEnqueue, current, clear } = useQueue();
    const { isPlaying } = usePlayer();
    const [ isPlaylistPlaying , setPlaylistPlaying ] = useState(false);

    useEffect (()=> {
        if ( isPlaylistPlaying ) {
            const isCurrentSongInPlaylist = songs.find((song)=>song.id===current?.id)
            if ( isCurrentSongInPlaylist ) {
                setPlaylistPlaying(true);
            } else {
                setPlaylistPlaying(false);
            }
        }
    }, [current]);

    return (
        <button className="rounded-full bg-red-600 flex items-center justify-center h-12 w-12 hover:scale-105 transition-all duration-150"
            onClick={(e)=>{
                e.stopPropagation();
                clear();
                priorityEnqueue(songs);
                setPlaylistPlaying(true)
            }}
        >
            {
                ( isPlaying && isPlaylistPlaying ) ? <FaPause className='h-5 w-5' /> : <FaPlay className='h-5 w-5' /> 
            }
        </button>
    )
}
