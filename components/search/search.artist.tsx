import { Artist } from "@prisma/client";
import { getArtistSearches } from "@/server/search";
import { ArtistCard } from "@/components/search/artist-card";


interface SearchArtistProps {
    query : string;
}

export const SearchArtist = async({ query }: SearchArtistProps) => {
    
    const data = await getArtistSearches(query);

    if (!data || data.length===0){
        return (
            <div className="w-full h-full flex items-center justify-center pt-32">
                <h4 className="font-semibold md:text-lg text-center text-zinc-300">No albums found for &quot;{query}&quot;</h4>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2 gap-y-4 md:gap-y-8 py-10">
            {
                data.map(({id, payload})=>(
                    <ArtistCard key={id} artist={payload as Artist} />
                ))
            }
        </div>
    )
}
