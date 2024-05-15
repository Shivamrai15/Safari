"use client";

import { useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Album, Song } from "@prisma/client";

import { useQueue } from "@/hooks/use-queue";
import { Button } from "@/components/ui/button";
import { FaPause, FaPlay } from "react-icons/fa";
import { useArtistStack } from "@/hooks/use-artist-stack";
import { usePlayer } from "@/hooks/use-player";

interface PlayButtonProps {
    artistId : string,
    songs : ( Song & { album : Album } )[];
}

export const PlayButton = ({
    artistId,
    songs
} : PlayButtonProps ) => {

    const session = useSession();
    const { isPlaying } = usePlayer();
    const { clear, current, priorityEnqueue, queue, stack, enQueue } = useQueue();
    const { list, listId, clearList, setList, setListId } = useArtistStack();

    const playing = useMemo(()=>{
        if ( listId!== artistId  ) {
            return false;
        }
        if ( list.length === 0 || !current) {
            return false;

        }
        return list.every((song)=>(stack.includes(song) || queue.includes(song))&&list.includes(current));
    }, [ current, list, stack, queue ]);
    
    const handlePlayButton = async()=>{
        clear();
        clearList();
        priorityEnqueue(songs);
        setList(songs);
        setListId(artistId)
        try {
            const response = await axios.get(`/api/v1/artist?id=${artistId}`);
            const data : ( Song & { album : Album } )[] = response.data;
            enQueue(data);
            setList(data);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <Button 
            className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-red-600 hover:bg-red-600/80 text-white"
            disabled = { session.status === "unauthenticated" || playing }
            onClick={handlePlayButton}
        >
            {
                (isPlaying && playing ) ? <FaPause className='h-5 w-5' /> : <FaPlay className='h-5 w-5' /> 
            }
        </Button>
    )
}
