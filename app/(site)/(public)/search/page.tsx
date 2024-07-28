import { Albums } from "@/components/search/albums";
import { ArtistCarousel } from "@/components/search/artist-carousel";
import { TopResult } from "@/components/search/top-result";
import { SongItem } from "@/components/song/song-item";
import { getTopSearches } from "@/server/search";

interface SearchPageProps {
    searchParams : {
        query : string
    }
}

const SearchPage = async({
    searchParams
} : SearchPageProps ) => {
    
    if (!searchParams.query)
        return null;

    const responses = await getTopSearches(searchParams.query);    

    if ( !responses?.topResult  ) {
        return (
            <div className="w-full h-full flex items-center justify-center pt-32">
                <h4 className="font-semibold md:text-lg text-center text-zinc-300 select-none">No results found for &quot;{searchParams.query}&quot;</h4>
            </div>
        )
    }

    const { albums, artists, songs, topResult } = responses;


    return (
        <div className="pt-10 space-y-12">
            <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl font-bold select-none" >Top Result</h1>
                <div>
                    <TopResult data={topResult!} />
                </div>
            </div>
            <div>
                { songs.length > 0 && (
                    <div className="space-y-8">
                        <h1 className="text-2xl md:text-3xl font-bold select-none" >Songs</h1>
                        <div>
                            {
                                songs.map((song)=>(
                                    <SongItem song={song} key={song.id} />
                                ))
                            }
                        </div>
                    </div>
                ) }
            </div>
            <div>
                { albums.length > 0 && (
                    <div className="space-y-8">
                        <h1 className="text-2xl md:text-3xl font-bold select-none" >Albums</h1>
                        <Albums albums={albums} />
                    </div>
                ) }
            </div>
            <div>
                { artists.length > 0 && (
                    <div className="space-y-8">
                        <h1 className="text-2xl md:text-3xl font-bold select-none" >Artists</h1>
                        <ArtistCarousel artists={artists} />
                    </div>
                ) }
            </div>
        </div>
    )
}

export default SearchPage;