"use client";
import { usePlayer } from '@/hooks/use-player';
import { useQueue } from '@/hooks/use-queue';
import { cn } from '@/lib/utils';
import { getAlbum } from '@/server/album';
import { Album, Artist, Song } from '@prisma/client';
import { FaPause, FaPlay } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SongPlayButton {
    songs? : (Song & {
        album : Album,
        artists : Artist[]
    })[];
    id : string;
    className? : string
}

export const SongPlayButton = ({
    songs,
    id,
    className
} : SongPlayButton ) => {

    const { priorityEnqueue, current } = useQueue();
    const { isPlaying } = usePlayer(); 
    const session = useSession();
    const router = useRouter();

    const handleButton = async() =>{
        if ( session.status === "unauthenticated" ) {
            router.push("/login");
        } else {
            if ( songs ){
                priorityEnqueue(songs);
            } else {
                const album = await getAlbum(id);
                if (album) {
                    priorityEnqueue(album.songs);
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
