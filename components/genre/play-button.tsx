"use client"

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { useQueue } from "@/hooks/use-queue";
import { usePlayer } from "@/hooks/use-player";
import { useGenreStack } from "@/hooks/use-genre-stack";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Album, Song } from "@prisma/client";
import { FaPause, FaPlay } from "react-icons/fa6";


interface PlayButtonProps {
    genreId : string;
    className? : string
}

export const PlayButton = ({
    genreId,
    className
} : PlayButtonProps) => {
    
    const session = useSession();
    const { isPlaying } = usePlayer();
    const { current, priorityEnqueue, clear, queue, stack } = useQueue();
    const [ loading, setLoading ] = useState(false);
    const { data, setData, uuid, setUuid, clearUuid } = useGenreStack();

    const playing = useMemo(()=>{

        if ( uuid !== genreId ) {
            return false;
        }

        if ( data.length === 0 || !current) {
            clearUuid();
            return false;

        }
        return data.every((song)=>(stack.includes(song) || queue.includes(song))&&data.includes(current));
    }, [current, data, queue, stack]);

    const handlePlayGenre = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/v2/genre/tracks?id=${genreId}`);
            const response_data : (Song & { album : Album })[] = response.data;
            setData(response_data);
            setUuid(genreId);
            clear();
            priorityEnqueue(response_data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <Button className={cn(
                "rounded-full bg-red-600 flex items-center justify-center h-12 w-12 hover:scale-105 transition-all duration-150",
                className
            )} 
            disabled = { session.status === "unauthenticated" || playing || loading }
            onClick={handlePlayGenre}
        >
            {
                (isPlaying && playing ) ? <FaPause className='h-5 w-5' /> : <FaPlay className='h-5 w-5' /> 
            }
        </Button>
    )
}
