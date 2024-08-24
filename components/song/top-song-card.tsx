"use client"

import Image from "next/image";
import { Album, Song } from "@prisma/client";
import { useQueue } from "@/hooks/use-queue";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/hooks/use-player";
import { Audio } from "react-loader-spinner";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { PRIORITY_ENQUEUE } from "@/lib/events";

interface TopSongCardProps {
    song : ( Song & { album : Album } );
    idx: number;
}

export const TopSongCard = ({
    song,
    idx,
} : TopSongCardProps ) => {

    const router = useRouter();
    const session = useSession();
    const { priorityEnqueue, current } = useQueue();
    const { isPlaying } = usePlayer();
    const socket = useSocket();
    const { connected, roomId } = useSocketEvents();

    return (
        <div className="h-40 md:h-44 flex items-center group">
            <span className="text-[12rem] md:text-[14rem] font-extrabold translate-x-2 p-0 m-0 z-10 text-border select-none group-hover:text-neutral-900/80 transition-all">
                {idx}
            </span>
            <div
                className="aspect-[3/4] h-40 md:h-44 w-full space-y-2 md:space-y-4 md:cursor-pointer"
                onClick={()=>{
                    if(session.status === "unauthenticated") {
                        router.push("/login");
    
                    } else {
                        priorityEnqueue([song]);
                        if ( connected ) {
                            socket.emit(PRIORITY_ENQUEUE, { roomId, songs:[song] });
                        }
                    }
                }}
            >
                <div className="aspect-[15/16] relative overflow-hidden">
                    <Image
                        src={song.image}
                        fill
                        alt={song.name}
                        className={cn(
                            "object-cover group-hover:brightness-50 transition-all duration-150",
                            (current?.id===song.id && isPlaying ) && "brightness-50"
                        )}
                    />
                    <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                        { (current?.id===song.id && isPlaying ) && <Audio color="#ef4444" height={40} />}
                    </div>
                </div>
                <div className="font-medium line-clamp-1 select-none text-center px-2">
                    {song.name}
                </div>
            </div>
        </div>
    )
}
