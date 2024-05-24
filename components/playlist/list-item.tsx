"use client"

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Album, Artist, Song } from "@prisma/client";
import { songLength } from "@/lib/utils";
import { SongOptions } from "@/components/song/song-options";
import { useQueue } from "@/hooks/use-queue";
import { SmallDevicesSongOptions } from "@/components/song/small-devices-song-options";
import { usePlayer } from "@/hooks/use-player";
import { Audio } from "react-loader-spinner";
import { useSession } from "next-auth/react";
import axios from "axios";
import { usePlaylist } from "@/hooks/use-playlist";

interface ListItemProps {
    song : Song & { album : Album , artists : Artist[] };
    index : number;
    playlistId : string;
    isAuth : boolean;
    playlistMutate : ( songId : string )=>void;
}

export const ListItem = ({
    song,
    index,
    playlistId,
    isAuth,
    playlistMutate
} : ListItemProps ) => {
    
    const router = useRouter();
    const { current ,priorityEnqueue } = useQueue();
    const session = useSession();
    const { isPlaying } = usePlayer();
    const { mutate } = usePlaylist();

    const handleRemoveSong = async()=>{
        playlistMutate(song.id);
        try {
            await axios.delete(`/api/v1/user/playlist/songs?playlistId=${playlistId}&songId=${song.id}`);
            mutate();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div
            className="grid grid-cols-7 md:grid-cols-11 gap-4 px-4 py-3 rounded-md hover:bg-neutral-800/80 items-center md:cursor-pointer transition-all md:px-6 group"
            onClick={()=>{
                if ( session.status === "authenticated" ) {
                    priorityEnqueue([song]);
                }
            }}
        >
                <div className="hidden md:flex justify-start items-center" >{ (current?.id===song.id && isPlaying ) ? <Audio width={25} color="#ef4444" height={25} /> : index}</div>
                <div className="col-span-5 flex items-center gap-x-4">
                    <div className="max-w-11 aspect-square w-full relative overflow-hidden rounded-sm">
                        <Image
                            src={song.image}
                            alt="Song"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="w-full">
                        <h3 className="text-base line-clamp-1 font-medium" >{song.name}</h3>
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
                </div>
                <div className="hidden md:block col-span-4 w-full">
                    <Link href={`/album/${song.albumId}`} className="line-clamp-1 text-sm text-zinc-300 font-medium hover:text-white hover:underline w-fit ">
                        {song.album.name}
                    </Link>
                </div>
                <div className="relative col-span-2 md:col-span-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-zinc-200">{songLength(song.duration)}</div>
                        <div className="hidden md:block md:opacity-0 md:group-hover:opacity-100 transition relative">
                            <SongOptions 
                                song={song}
                                playlistId={playlistId}
                                isAuth={isAuth}
                                onDelete={handleRemoveSong}
                            />
                        </div> 
                        <div className="md:hidden">
                            <SmallDevicesSongOptions song={song} />
                        </div>
                    </div>
                </div>
        </div>
    )
}
