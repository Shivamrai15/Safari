"use client";

import { Album, Artist, Song } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SmallDevicesSongOptions } from "./small-devices-song-options";
import { SongOptions } from "./song-options";
import { useQueue } from "@/hooks/use-queue";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { PRIORITY_ENQUEUE } from "@/lib/events";

interface SongCardProps {
    song : Song & { album : Album , artists : Artist[] }
}

export const SongCard = ({
    song
} : SongCardProps ) => {
    
    const router = useRouter();
    const { priorityEnqueue } = useQueue();
    const socket = useSocket();
    const { connected, roomId } = useSocketEvents();

    return (
        <div
            className="w-full bg-neutral-900 hover:bg-neutral-800/90 transition-all rounded-sm group p-2 md:cursor-pointer"
            onClick={()=>{
                priorityEnqueue([song]);
                if ( connected ) {
                    socket.emit(PRIORITY_ENQUEUE, { roomId, songs:[song] });
                }
            }}
        >
            <div className="flex items-center gap-x-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden relative">
                    <Image
                        src={song.image}
                        fill
                        alt={song.name}
                        className="object-cover select-none"
                        
                    />
                </div>
                <div className="w-full relative">
                    <h4 className="font-semibold text-base line-clamp-1 select-none" >{song.name}</h4>
                    <div className="text-sm text-zinc-300 line-clamp-1 font-normal overflow-hidden space-x-2" >
                        {
                            song.artists.map((artist, idx)=>(
                                <span
                                    key={artist.id}
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        router.push(`/artist/${artist.id}`);
                                    }}
                                    className="hover:underline select-none md:cursor-pointer"
                                >
                                    {artist.name}{ (idx !== song.artists.length-1)&&"," }
                                </span>
                            ))
                        }
                    </div>
                </div>
                <div className="px-3">
                    <div className="hidden md:block md:opacity-0 md:group-hover:opacity-100 transition relative">
                        <SongOptions song={song} />
                    </div>
                    <div className="md:hidden">
                        <SmallDevicesSongOptions song={song} />
                    </div>
                </div>
            </div>
        </div>
    )
}
