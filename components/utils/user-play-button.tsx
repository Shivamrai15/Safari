"use client";

import { useEffect, useState } from "react";
import { usePlayer } from "@/hooks/use-player";
import { useQueue } from "@/hooks/use-queue";
import { Song , Album} from "@prisma/client"
import { FaPause, FaPlay } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { PRIORITY_ENQUEUE } from "@/lib/events";

interface PlayButtonProps {
    songs : (Song & { album : Album })[];
    className? : string;
}

export const PlayButton = ({
    songs,
    className
} : PlayButtonProps ) => {

    const socket = useSocket();
    const { connected, roomId } = useSocketEvents();

    const { isPlaying } = usePlayer();
    const { priorityEnqueue, current, clear } = useQueue();
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
        <button 
            className={cn(
                "rounded-full bg-red-600 flex items-center justify-center h-12 w-12 hover:scale-105 transition-all duration-150",
                className
            )}
            onClick={(e)=>{
                e.stopPropagation();
                clear();
                priorityEnqueue(songs);
                setPlaylistPlaying(true);
                if ( connected ) {
                    socket.emit(PRIORITY_ENQUEUE, { roomId, songs });
                }
            }}
        >
            {
                ( isPlaying && isPlaylistPlaying ) ? <FaPause /> : <FaPlay /> 
            }
        </button>
    )
}
