"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMoodStack } from "@/hooks/use-mood-stack";
import { usePlayer } from "@/hooks/use-player";
import { useQueue } from "@/hooks/use-queue";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";

import axios from "axios";
import { Album, Song } from "@prisma/client";
import { CLEAR, PRIORITY_ENQUEUE } from "@/lib/events";
import { toast } from "sonner";
import { FaPause, FaPlay } from "react-icons/fa";

interface PlayButtonProps {
    id :  string;
}

export const PlayButton = ({
    id
}: PlayButtonProps) => {

    const session = useSession();
    const socket = useSocket();
    const { isPlaying } = usePlayer();
    const { connected, roomId } = useSocketEvents();
    const { current, priorityEnqueue, clear, queue, stack } = useQueue();
    const { data, setData, uuid, setUuid, clearUuid } = useMoodStack();
    const [ loading, setLoading ] = useState(false)

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

    const handlePlay = async () => {
        try {

            console.log("Playing mood with id:", id);
            setLoading(true);
            const response = await axios.get(`/api/v1/moods/${id}`);
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
            toast.error("Failed to play mood. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            className="rounded-full z-10 bg-white text-black flex items-center justify-center h-12 w-12 hover:scale-105 transition-all"
            onClick={(e)=>{
                e.stopPropagation();
                handlePlay();
            }}
            disabled = { session.status === "unauthenticated" || playing || loading }
        >
            {
                (isPlaying && playing ) ? <FaPause className='h-5 w-5' /> : <FaPlay className='h-5 w-5' /> 
            }
        </button>
    )
}
