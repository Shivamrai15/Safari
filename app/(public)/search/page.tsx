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

    if ( !responses?.bestResult ) {
        return (
            <div className="w-full h-full flex items-center justify-center pt-32">
                <h4 className="font-semibold text-lg md:text-xl text-center text-zinc-300">No results found for &quot;{searchParams.query}&quot;</h4>
            </div>
        )
    }

    const albums = responses.albumResults.map((album)=>album.item);
    const artists = responses.artistResults.map((artist)=>artist.item);

    return (
        <div className="pt-10 space-y-12">
            <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl font-bold" >Top Result</h1>
                <div>
                    <TopResult data={responses.bestResult.item} />
                </div>
            </div>
            <div>
                { responses.songResults.length > 0 && (
                    <div className="space-y-8">
                        <h1 className="text-2xl md:text-3xl font-bold" >Songs</h1>
                        <div>
                            {
                                responses.songResults.map((song)=>(
                                    <SongItem song={song.item} key={song.item.id} />
                                ))
                            }
                        </div>
                    </div>
                ) }
            </div>
            <div>
                { albums.length > 0 && (
                    <div className="space-y-8">
                        <h1 className="text-2xl md:text-3xl font-bold" >Albums</h1>
                        <Albums albums={albums} />
                    </div>
                ) }
            </div>
            <div>
                { artists.length > 0 && (
                    <div className="space-y-8">
                        <h1 className="text-2xl md:text-3xl font-bold" >Artists</h1>
                        <ArtistCarousel artists={artists} />
                    </div>
                ) }
            </div>
        </div>
    )
}

export default SearchPage;