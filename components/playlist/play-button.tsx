"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { usePlayer } from "@/hooks/use-player";
import { useQueue } from "@/hooks/use-queue";
import { FaPause, FaPlay } from "react-icons/fa";
import { Album, Song } from "@prisma/client";
import axios from "axios";
import { usePlaylistStack } from "@/hooks/use-playlist-stack";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { CLEAR, PRIORITY_ENQUEUE } from "@/lib/events";

interface PlayButtonProps {
    id :  string;
}

export const PlayButton = ({
    id
} : PlayButtonProps ) => {
    
    const session = useSession();
    const socket = useSocket();
    const { connected, roomId } = useSocketEvents();
    const { isPlaying } = usePlayer();
    const { current, priorityEnqueue, clear, queue, stack } = useQueue();
    const [ loading, setLoading ] = useState(false);
    const { data, setData, uuid, setUuid, clearUuid } = usePlaylistStack();

    const playing = useMemo(()=>{

        if ( uuid !== id ) {
            return false;
        }

        if ( data.length === 0 || !current) {
            clearUuid();
            return false;

        }
        return data.every((song)=>(stack.includes(song) || queue.includes(song))&&data.includes(current));
    }, [current, data, queue, stack]);

    const handlePlayPlaylist = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/v1/user/playlist/${id}`);
            const response_data : (Song & { album : Album })[] = response.data;
            setData(response_data);
            setUuid(id);
            clear();
            priorityEnqueue(response_data);
            if ( connected ) {
                socket.emit(CLEAR, {roomId});
                socket.emit(PRIORITY_ENQUEUE, {roomId, songs:response_data});
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button className="rounded-full bg-red-600 flex items-center justify-center h-12 w-12 hover:scale-105 transition-all duration-150"
            disabled = { session.status === "unauthenticated" || playing || loading }
            onClick={handlePlayPlaylist}
        >
            {
                (isPlaying && playing ) ? <FaPause className='h-5 w-5' /> : <FaPlay className='h-5 w-5' /> 
            }
        </button>
    )
}
