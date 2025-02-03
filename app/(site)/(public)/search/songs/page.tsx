import { Suspense } from "react";
import { SearchSong } from "@/components/search/search.song";
import { Loader } from "@/components/utils/loader";

interface SongSearchPageProps {
    searchParams : { 
        query : string
    };
}

const SongSearchPage = ({
    searchParams
} : SongSearchPageProps ) => {

    if (!searchParams.query)
        return null;

    return (
        <Suspense fallback={<Loader/>} >
            <SearchSong query={searchParams.query} />
        </Suspense>
    )
    
}

export default SongSearchPage;