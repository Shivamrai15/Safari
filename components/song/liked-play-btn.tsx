"use client";

import { useSession } from "next-auth/react";
import { usePlayer } from "@/hooks/use-player";
import { useQueue } from "@/hooks/use-queue";
import { useLikedSongs } from "@/hooks/use-liked-songs";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { FaPause, FaPlay } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";


interface LikedMusicPageProps {
    className? : string
}


export const LikedPlayButton = ({
    className
} : LikedMusicPageProps ) => {
    
    const session = useSession();
    const { isPlaying } = usePlayer();
    const { current, queue, stack, priorityEnqueue } = useQueue();
    const { songIds } = useLikedSongs();

    const playing = useMemo(()=>{
        if ( songIds.length === 0 || !current) {
            return false;

        }
        return songIds.every((id)=>(stack.find((song)=>song.id===id) || queue.find((song)=>song.id===id))&&songIds.includes(current.id));
    }, [ current, songIds, stack, queue ]);


    const handlePlayButton = async()=>{
        try {

            const response = await axios.get("/api/v1/user/liked-music/tracks");
            priorityEnqueue(response.data);
            
        } catch (error) {
            console.log(error);
            toast.error("Something went worng")
        }
    }

    
    return (
        <Button 
            className={cn(
                "h-12 w-12 md:h-14 md:w-14 rounded-full bg-red-600 hover:bg-red-600/80 text-white",
                className
            )}
            disabled = { session.status === "unauthenticated" || playing }
            onClick={(e)=>{
                e.stopPropagation();
                handlePlayButton();
            }}
        >
            {
                (isPlaying && playing ) ? <FaPause className='h-5 w-5' /> : <FaPlay className='h-5 w-5' /> 
            }
        </Button>
    )
}
