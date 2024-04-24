"use client";

import Image from "next/image";
import { Album, Artist, Song } from "@prisma/client";
import { useRouter } from "next/navigation";
import { songLength } from "@/lib/utils";
import { SongOptions } from "./song-options";
import { SmallDevicesSongOptions } from "./small-devices-song-options";

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

    return (
        <div className="w-full h-full px-4 gap-4 md:gap-6 py-2 group hover:bg-neutral-800/70 rounded-sm transition-all md:cursor-pointer select-none">
            <div className="flex items-center gap-4 md:gap-6 font-semibold text-lg">
                <div className="w-10 aspect-square relative rounded-sm overflow-hidden">
                    <Image
                        src={song.image}
                        alt={song.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="w-full flex-1 shrink overflow-hidden">
                    <p className="text-base line-clamp-1" >{song.name.trim()}</p>
                    <div
                        className="text-sm text-zinc-300 line-clamp-1 font-normal overflow-hidden space-x-2 hover:underline"
                        onClick={()=>router.push(`/album/${song.albumId}`)}
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
