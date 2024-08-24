"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Audio } from "react-loader-spinner";

import { songLength } from "@/lib/utils";
import { Album, Song } from "@prisma/client"
import { SongOptions } from "./song-options";
import { SmallDevicesSongOptions } from "./small-devices-song-options";
import { useQueue } from "@/hooks/use-queue";
import { usePlayer } from "@/hooks/use-player";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { PRIORITY_ENQUEUE } from "@/lib/events";

interface ListItemProps {
    song : Song & {
        artists : {id : string, name : string, image: string}[],
        album : Album
    };
    index : number
}

export const ListItem = ({
    song,
    index
} : ListItemProps ) => {

    const router = useRouter();
    const session = useSession();
    const { priorityEnqueue, current } = useQueue();
    const { isPlaying } = usePlayer();
    const socket = useSocket();
    const { connected, roomId } = useSocketEvents();

    return (
        <div
            className="w-full h-full px-4 gap-4 md:gap-6 py-3 group hover:bg-neutral-800/70 rounded-sm transition-all md:cursor-pointer select-none"
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
            <div className="flex items-center gap-4 md:gap-6 font-semibold text-lg">
                <h4 className="w-8 text-base shrink-0">
                    { (current?.id===song.id && isPlaying ) ? <Audio color="#ef4444" height={25} /> : index}
                </h4>
                <div className="w-full flex-1 shrink overflow-hidden">
                    <p className="text-base line-clamp-1" >{song.name.trim()}</p>
                    <div className="text-sm text-zinc-300 line-clamp-1 font-normal overflow-hidden space-x-2" >
                        {
                            song.artists.map((artist, idx)=>(
                                <span
                                    key={artist.id}
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        router.push(`/artist/${artist.id}`);
                                    }}
                                    className="hover:underline"
                                >
                                    {artist.name}{ (idx !== song.artists.length-1)&&"," }
                                </span>
                            ))
                        }
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="flex items-center w-14 justify-center text-sm md:text-base font-medium">
                        { songLength(song.duration) }
                    </div>
                    <div className="w-12 flex items-center justify-center">
                        <div className="hidden md:block md:opacity-0 md:group-hover:opacity-100 transition relative">
                            <SongOptions song={song} />
                        </div>
                        <div className="md:hidden">
                            <SmallDevicesSongOptions song={song} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
