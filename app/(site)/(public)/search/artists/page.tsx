import { ArtistCard } from "@/components/search/artist-card";
import { getArtistSearches } from "@/server/search";

interface ArtistsSearchPageProps { 
    searchParams : {
        query : string
    };
}

const ArtistsSearchPage = async({
    searchParams
} : ArtistsSearchPageProps ) => {

    if (!searchParams.query)
        return null;

    const responses = await getArtistSearches(searchParams.query);

    if (!responses){
        return (
            <div className="w-full h-full flex items-center justify-center pt-32">
                <h4 className="font-semibold md:text-lg text-center text-zinc-300">No albums found for &quot;{searchParams.query}&quot;</h4>
            </div>
        )
    }

    const artists = responses.map((artist)=>artist.item);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 gap-y-8 md:gap-10 md:gap-y-8 lg:gap-y-16 py-10">
            {
                artists.map((artist : {id : string, name : string, image: string})=>(
                    <ArtistCard key={artist.id} artist={artist} />
                ))
            }
        </div>
    )
}

export default ArtistsSearchPage;