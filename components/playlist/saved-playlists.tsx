"use client";

import { PlayList } from "@prisma/client";
import { useLikedSongs } from "@/hooks/use-liked-songs";
import { SavedPlaylistCard } from "./saved-playlist-card";
import { usePlaylist } from "@/hooks/use-playlist";
import { CreatePlaylistCard } from "./create-playlist-card";

export const SavedPalylists = () => {

    const likedSongs = useLikedSongs();
    const { data, isLoading } : { data : (PlayList & { _count: { songs: number} })[], isLoading: boolean } = usePlaylist();

    return (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" >
            <CreatePlaylistCard/>
            <SavedPlaylistCard
                name="Liked Songs"
                image="/assets/liked-thumb.png"
                url="/liked-music"
                tracks={ likedSongs.isLoading ? 0 : likedSongs.data.length }
            />
            { !isLoading && data.map((playlist)=>(
                <SavedPlaylistCard
                    key={playlist.id}
                    name={playlist.name}
                    image={playlist?.image || "/assets/playlist.png"}
                    tracks={playlist._count.songs}
                    url={`/playlists/${playlist.id}`}
                />
            )) }
        </section>
    )
}
