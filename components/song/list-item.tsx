"use client";
import { songLength } from "@/lib/utils";
import { Artist, Song } from "@prisma/client"
import { useRouter } from "next/navigation";
import { SongOptions } from "./song-options";
import { SmallDevicesSongOptions } from "./small-devices-song-options";

interface ListItemProps {
    song : Song & {
        artists : Artist[]
    };
    index : number
}

export const ListItem = ({
    song,
    index
} : ListItemProps ) => {

    const router = useRouter();

    return (
        <div className="w-full h-full px-4 gap-4 md:gap-6 py-3 group hover:bg-neutral-800/70 rounded-sm transition-all md:cursor-pointer select-none">
            <div className="flex items-center gap-4 md:gap-6 font-semibold text-lg">
                <h4 className="w-8 text-base shrink-0">{index}</h4>
                <div className="w-full flex-1 shrink overflow-hidden">
                    <p className="text-base line-clamp-1" >{song.name.trim()}</p>
                    <div className="text-sm text-zinc-300 line-clamp-1 font-normal overflow-hidden space-x-2" >
                        {
                            song.artists.map((artist, idx)=>(
                                <span
                                    key={artist.id}
                                    onClick={()=>router.push(`/artist/${artist.id}`)}
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
