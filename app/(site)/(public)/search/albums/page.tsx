import { AlbumCard } from "@/components/album/album-card";
import { getAlbumSearches } from "@/server/search";
import { Album } from "@prisma/client";

interface SearchAlbumPageProps {
    searchParams : {
        query : string
    }
}

const SearchAlbumPage = async({
    searchParams
} : SearchAlbumPageProps ) => {

    if (!searchParams.query)
        return null;

    const albums = await getAlbumSearches(searchParams.query);
    
    if (!albums){
        return (
            <div className="w-full h-full flex items-center justify-center pt-32">
                <h4 className="font-semibold md:text-lg text-center text-zinc-300">No albums found for &quot;{searchParams.query}&quot;</h4>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 gap-y-8 md:gap-10 md:gap-y-8 lg:gap-y-16 py-10">
            {
                albums.map((album : Album)=>(
                    <AlbumCard
                        album={album}
                        key={album.id}
                        className="w-full h-full"
                    />
                ))
            }
        </div>
    )
}

export default SearchAlbumPage;