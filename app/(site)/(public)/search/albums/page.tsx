import { Suspense } from "react";
import { SearchAlbum } from "@/components/search/search.album";
import { Loader } from "@/components/utils/loader";


interface SearchAlbumPageProps {
    searchParams : {
        query : string
    }
}

const SearchAlbumPage = ({
    searchParams
} : SearchAlbumPageProps ) => {

    if (!searchParams.query)
        return null;

    return (
        <Suspense fallback={<Loader/>} >
            <SearchAlbum query={searchParams.query} />
        </Suspense>
    )

    
}

export default SearchAlbumPage;