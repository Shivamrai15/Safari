"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AccountResponse, Song } from "@/types";
import { SmallDevicesSongOptions } from "./small-devices-song-options";
import { SongOptions } from "./song-options";
import { useQueue } from "@/hooks/use-queue";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { PRIORITY_ENQUEUE } from "@/lib/events";
import { useAccount } from "@/hooks/use-account";
import { cn } from "@/lib/utils";

interface SongCardProps {
    song : Song;
    className? : string;
}

export const SongCard = ({
    song,
    className
} : SongCardProps ) => {
    
    const router = useRouter();
    const { priorityEnqueue, queue, enQueue } = useQueue();
    const socket = useSocket();
    const { connected, roomId } = useSocketEvents();
    const { data, isLoading } : { data: AccountResponse, isLoading: boolean } = useAccount();

    const handlePlay = async ()=>{
        priorityEnqueue([song]);
        if ( connected ) {
            socket.emit(PRIORITY_ENQUEUE, { roomId, songs:[song] });
        }
        else if (queue.length==0 && !isLoading && data && data.showRecommendations){
            try {
                const response = await axios.get(`/api/v1/song/recommendations?id=${song.id}`);
                const recommendations = response.data as Song[];
                enQueue(recommendations);
            } catch (error) {
               console.log(error); 
            }
        }
    }


    return (
        <div
            className={cn(
                "w-full bg-neutral-900 hover:bg-neutral-800/90 transition-all rounded-sm group p-2 md:cursor-pointer",
                className
            )}
            onClick={handlePlay}
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
                <div className="relative flex-1">
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
