import { SongItem } from "@/components/song/song-item";
import { getSongSearches } from "@/server/search";

interface SearchSongProps {
    query : string;
}

export const SearchSong = async({ query }: SearchSongProps) => {

    const songs = await getSongSearches(query);

    if (!songs){
        return (
            <div className="w-full h-full flex items-center justify-center pt-32">
                <h4 className="font-semibold md:text-lg text-center text-zinc-300">No albums found for &quot;{query}&quot;</h4>
            </div>
        )
    }
    
    return (
        <div className="w-full py-10 flex flex-col gap-y-1">
            {
                songs.map((song) => (
                    <SongItem song={song} key={song.id} />
                ))
            }
        </div>
    )
}
