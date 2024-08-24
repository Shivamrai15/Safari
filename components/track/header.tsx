"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { songLength } from '@/lib/utils';
import { Album, Song } from '@prisma/client'
import { Dot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/hooks/use-player';
import { useQueue } from '@/hooks/use-queue';
import { FaPause, FaPlay } from 'react-icons/fa6';
import { SongOptions } from '@/components/song/song-options';
import { useSocket } from '@/hooks/use-socket';
import { useSocketEvents } from '@/hooks/use-socket-events';
import { PRIORITY_ENQUEUE } from '@/lib/events';


interface HeaderProps {
    song: Song & { 
        album: Album,
        artists: {id: string, name: string, image: string}[],
        _count : { view : number }
    };
}

export const Header = ({
    song,
} : HeaderProps ) => {

    const router = useRouter();
    const session = useSession();
    const { current, priorityEnqueue } = useQueue();
    const { isPlaying } = usePlayer();
    const socket = useSocket();
    const { connected, roomId } = useSocketEvents();

    return (
        <header className="px-4 md:px-20" style={{background :  `linear-gradient(160deg, ${song.album.color} 40%, #111 30%)` }}>
            <div className="pt-14 md:pt-20 pb-10">
                    <div
                        className="flex flex-col md:flex-row items-center gap-x-8"
                    >
                        <div
                            className="relative shrink-0 aspect-square h-44 w-44 lg:h-60 lg:w-60 shadow-xl"
                        >
                            <Image
                                fill
                                alt={song.name}
                                src={song.image}
                                className="object-cover rounded-md"
                            />
                        </div>
                        <div
                            className="flex flex-col gap-y-2 mt-4 md:mt-0 text-center md:text-left md:pr-28"
                        >
                            <Link
                                className="hidden md:block font-semibold text-sm select-none md:cursor-pointer hover:cursor-pointer"
                                href={`/album/${song.albumId}`}
                            >
                                {song.album.name}
                            </Link>
                            <h1 className="text-white text-4xl sm:text-5xl lg:text-8xl font-extrabold line-clamp-1 overflow-hidden select-none">
                                {song.name}
                            </h1>
                            <div className="font-semibold text-sm flex items-center justify-center md:justify-start">
                                <span className="select-none">
                                    {`${song._count.view.toLocaleString()} Plays`}
                                </span>
                                <Dot/>
                                <span className="select-none">
                                    { song.album.release.getFullYear() }
                                </span>
                                <Dot/>
                                <span className="select-none">
                                    { songLength(song.duration) }
                                </span>
                            </div>
                            <div className="flex justify-center md:justify-start items-center gap-6 pt-2 md:pr-28" >
                                <Button
                                    className= "h-12 w-12 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all duration-300"
                                    disabled = { current?.id===song.id }
                                    onClick= {()=>{
                                        if ( session.status === "unauthenticated" ) {
                                            router.push("/login");
                                            return;
                                        } 
                                        priorityEnqueue([song]);
                                        if ( connected ) {
                                            socket.emit(PRIORITY_ENQUEUE, { roomId, songs:[song] });
                                        }
                                    }}
                                >
                                    {
                                        (current?.id === song.id && isPlaying) ? (
                                            <FaPause className="h-5 w-5" />
                                        ) : (
                                            <FaPlay className="h-5 w-5" />
                                        )
                                    }
                                </Button>
                                <SongOptions song={song} />
                            </div>
                        </div>
                    </div>    
            </div>
        </header>
    )
}
