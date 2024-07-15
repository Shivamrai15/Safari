"use client";
import { usePlayer } from '@/hooks/use-player';
import { useQueue } from '@/hooks/use-queue';
import { cn } from '@/lib/utils';
import { Album, Song } from '@prisma/client';
import { FaPause, FaPlay } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useSocket } from '@/hooks/use-socket';
import { useSocketEvents } from '@/hooks/use-socket-events';
import { PRIORITY_ENQUEUE } from '@/lib/events';

interface SongPlayButton {
    songs? : (Song & {
        album : Album,
        artists : {id : string, name : string, image: string}[]
    })[];
    id : string;
    className? : string
}

export const SongPlayButton = ({
    songs,
    id,
    className
} : SongPlayButton ) => {

    const socket = useSocket();
    const router = useRouter();
    const session = useSession();
    const { priorityEnqueue, current } = useQueue();
    const { isPlaying } = usePlayer(); 
    const { connected, roomId } = useSocketEvents();

    const handleButton = async() =>{
        if ( session.status === "unauthenticated" ) {
            router.push("/login");
        } else {
            if ( songs ){
                priorityEnqueue(songs);
                if ( connected ) {
                    socket.emit(PRIORITY_ENQUEUE, { roomId, songs });
                }
            } else {
                try {
                    const songs : ( Song & { album : Album } )[] = (await axios.get(`${process.env.NEXT_PUBLIC_SOCKET_API}/api/v2/album?id=${id}`)).data;
                    priorityEnqueue(songs);
                    if ( connected ) {
                        socket.emit(PRIORITY_ENQUEUE, { roomId, songs });
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Something went wrong");
                }
            }
        }
    }

    return (
        <button className={cn(
                "rounded-full bg-red-600 flex items-center justify-center h-12 w-12 hover:scale-105 transition-all duration-150",
                className
            )}
            onClick={(e)=>{
                e.stopPropagation();
                handleButton();
            }}
            disabled = { isPlaying && current?.albumId === id }
        >
            {
                (isPlaying && current?.albumId === id) ? <FaPause className='h-5 w-5' /> : <FaPlay className='h-5 w-5' /> 
            }
        </button>
    )
}
