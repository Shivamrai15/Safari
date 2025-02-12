"use client";

import { PlayList } from "@prisma/client";
import { SyncLoader } from "react-spinners";
import { usePlaylist } from "@/hooks/use-playlist";
import { SavedPlaylistCard } from "@/components/playlist/saved-playlist-card";


type Response  = {
    data : (PlayList & { _count: {
        songs: number;
    }; })[] | undefined | null;
    isLoading : boolean;
    error : any;
}


export const Playlists = () => {

    const { data, isLoading, error } : Response = usePlaylist();

    if (error) {
        return (
            null
        )
    }

    if (!isLoading && !data ) {
        return (
            <div className="flex items-center justify-center text-zinc-300 font-medium select-none">
                Something went wrong
            </div>
        )
    }

    return (
        <section
            className="w-full space-y-10"
        >
            <h1 className="text-2xl md:text-3xl font-extrabold select-none">Your Playlists</h1>
            {
                isLoading
                ? (
                    <div className="w-full flex items-center justify-center py-6">
                        <SyncLoader color="#252525" />
                    </div>
                )
                : ( data && data.length>0 )
                ? (
                    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                        {data.map((playlist)=>(
                            <SavedPlaylistCard
                                key={playlist.id}
                                image={playlist.image || "/assets/playlist.png"}
                                url={`/playlists/${playlist.id}`}
                                name={playlist.name}
                                tracks={playlist._count.songs}
                            />
                        ))}
                    </div>
                )
                : (
                    <div className="w-full p-3 font-medium text-zinc-100 bg-neutral-800 rounded-md select-none">
                        You&apos;ve not created any playlists yet 
                    </div>
                )
            }
        </section>
    )
}
