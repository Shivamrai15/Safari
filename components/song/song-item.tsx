"use client";

import Image from "next/image";
import { Album, Artist, Song } from "@prisma/client";
import { useRouter } from "next/navigation";
import { cn, songLength } from "@/lib/utils";
import { SongOptions } from "./song-options";
import { SmallDevicesSongOptions } from "./small-devices-song-options";
import { useQueue } from "@/hooks/use-queue";
import { Audio } from "react-loader-spinner";
import { usePlayer } from "@/hooks/use-player";
import { useSession } from "next-auth/react";

interface SongItemProps {
    song : (Song & {
        artists : Artist[],
        album : Album
    })   
    
}

export const SongItem = ({
    song
} : SongItemProps ) => {

    const router = useRouter();
    const session = useSession();
    const { priorityEnqueue, current } = useQueue();
    const { isPlaying } = usePlayer();

    return (
        <div
            className="w-full h-full px-4 gap-4 md:gap-6 py-2 group hover:bg-neutral-800/70 rounded-sm transition-all md:cursor-pointer select-none"
            onClick={()=>{
                if(session.status === "unauthenticated") {
                    router.push("/login");

                } else {
                    priorityEnqueue([song])
                }
            }}
        >
            <div className="flex items-center gap-4 md:gap-6 font-semibold text-lg">
                <div className="w-10 aspect-square relative rounded-sm overflow-hidden">
                    <Image
                        src={song.image}
                        alt={song.name}
                        fill
                        className={cn(
                            "object-cover",
                            (song.id === current?.id) && isPlaying && "brightness-50"
                        )}
                    />
                    {
                        song.id === current?.id && isPlaying && (
                            <div className="h-full w-full absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                                <Audio color="#ef4444" height={30} />
                            </div>
                        )
                    }
                </div>
                <div className="w-full flex-1 shrink overflow-hidden">
                    <p className="text-base line-clamp-1" >{song.name.trim()}</p>
                    <div
                        className="text-sm w-fit text-zinc-300 line-clamp-1 font-normal overflow-hidden space-x-2 hover:underline"
                        onClick={(e)=>{
                            e.stopPropagation();
                            router.push(`/album/${song.albumId}`)
                        }}
                    >
                        {song.album.name}
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
