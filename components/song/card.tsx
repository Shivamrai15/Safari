"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Album, Song } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueue } from "@/hooks/use-queue";
import { usePlayer } from "@/hooks/use-player";
import { FaPause, FaPlay } from "react-icons/fa6";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { PRIORITY_ENQUEUE } from "@/lib/events";

interface CardProps {
    song : (Song & { album: Album });
}


export const Card = ({
    song
} : CardProps ) => {

    const router = useRouter();
    const session = useSession();
    const socket = useSocket();

    const { isPlaying } = usePlayer();
    const { current, priorityEnqueue } = useQueue();
    const { connected, roomId } = useSocketEvents();
    
    
    return (
        <div
            className="w-full bg-neutral-900 p-3 rounded-md hover:bg-neutral-800/80 group space-y-4 md:cursor-pointer select-none transition-colors"
            onClick={()=>router.push(`/track?id=${song.id}`)}
        >
            <div className="w-full aspect-square rounded-md relative overflow-hidden">
                <Image
                    src={song.image}
                    alt={song.name}
                    fill
                    className="object-cover group-hover:brightness-50 transition-all duration-150"
                />
                <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100">
                        <Button
                            className={cn(
                                "h-12 w-12 rounded-full bg-red-600 hover:bg-red-500 text-white delay-75 transition opacity-0 duration-300 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0"
                            )}
                            disabled = { current?.id===song.id }
                            onClick= {(e)=>{
                                e.stopPropagation();
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
                    </div>
                </div>
            </div>
            <div className="pb-2">
                <h2 className="line-clamp-1 font-medium select-none">{song.name}</h2>
            </div>
        </div>
    )
}
