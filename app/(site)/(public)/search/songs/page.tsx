import { SongItem } from "@/components/song/song-item";
import { getSongSearches } from "@/server/search";
import { Album, Song } from "@prisma/client";

interface SongSearchPageProps {
    searchParams : { 
        query : string
    };
}

const SongSearchPage = async({
    searchParams
} : SongSearchPageProps ) => {

    if (!searchParams.query)
        return null;

    const songs = await getSongSearches(searchParams.query);

    if (!songs){
        return (
            <div className="w-full h-full flex items-center justify-center pt-32">
                <h4 className="font-semibold md:text-lg text-center text-zinc-300">No albums found for &quot;{searchParams.query}&quot;</h4>
            </div>
        )
    }
    
    return (
        <div className="w-full py-10 flex flex-col gap-y-1">
            {
                songs.map((song : Song & { album : Album, artists  : {id : string, name : string, image: string}[] })=>(
                    <SongItem song={song} key={song.id} />
                ))
            }
        </div>
    )
}

export default SongSearchPage;