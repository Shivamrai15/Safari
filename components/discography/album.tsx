"use client";
import { Album, Song } from "@prisma/client";
import Image from "next/image";
import { PlayButton } from "@/components/utils/user-play-button";
import { Options } from "@/components/album/options";
import { SongsList } from "@/components/song/songs-list";

interface AlbumProps {
    album : Album & {songs : (Song & {artists : ({ id: string, name: string, image: string })[]})[] } 
}

export const AlbumSection = ({
    album
} : AlbumProps) => {
    
    return (
        <div className="flex flex-col">
            <div className="flex items-start gap-x-6 md:gap-x-10">
                <div className="shrink-0 h-20 md:h-32 aspect-square relative rounded-md overflow-hidden shadow-lg shadow-neutral-950">
                    <Image
                        src={album.image}
                        fill
                        className="object-cover"
                        alt={album.name}
                    />
                </div>
                <div className="flex flex-col justify-between gap-y-6">
                    <div>
                        <h1 className="text-xl md:text-2xl font-semibold line-clamp-1 select-none">{album.name}</h1>
                        <span className="text-zinc-400 text-sm font-medium">
                            {album.songs.length === 1 ? "Single" : "Playlist" } • {new Date(album.release).getFullYear()} • {album.songs.length} Songs
                        </span>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <PlayButton
                            songs={ album.songs.map((song)=> { 
                                return {...song, album}
                            })}
                            className="h-8 w-8 bg-white text-[#121212]"
                        />
                        <Options
                            id={album.id}
                            songs={ album.songs.map((song)=> { 
                                return {...song, album}
                            })}
                            orientation="horizontal"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full">
                <SongsList 
                    songs={ album.songs.map((song)=> { 
                        return {...song, album}
                    })}
                />
            </div>
        </div>
    )
}
