import { Suspense } from "react";
import { Search } from "@/components/search/search";
import { Loader } from "@/components/utils/loader";


interface SearchPageProps {
    searchParams : {
        query : string
    }
}

const SearchPage = ({
    searchParams
} : SearchPageProps ) => {
    
    if (!searchParams.query)
        return null;

    return (
        <Suspense fallback={<Loader/>} >
            <Search query={searchParams.query} />
        </Suspense>
    )

    
}

export default SearchPage;