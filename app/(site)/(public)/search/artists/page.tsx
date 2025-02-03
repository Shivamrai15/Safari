import { Suspense } from "react";
import { SearchArtist } from "@/components/search/search.artist";
import { Loader } from "@/components/utils/loader";


interface ArtistsSearchPageProps { 
    searchParams : {
        query : string
    };
}

const ArtistsSearchPage = ({
    searchParams
} : ArtistsSearchPageProps ) => {

    if (!searchParams.query)
        return null;

    return (
        <Suspense fallback={<Loader/>} >
            <SearchArtist query={searchParams.query} />
        </Suspense>
    )

    
}

export default ArtistsSearchPage;