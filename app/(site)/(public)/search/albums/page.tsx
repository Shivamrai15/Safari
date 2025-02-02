"use client";

import { useQuery } from "@tanstack/react-query";
import { AlbumCard } from "@/components/album/album-card";
import { getAlbumSearches } from "@/server/search";
import { Album } from "@prisma/client";
import { SyncLoader } from "react-spinners";



interface SearchAlbumPageProps {
    searchParams : {
        query : string
    }
}

const SearchAlbumPage = ({
    searchParams
} : SearchAlbumPageProps ) => {


    const { data, isPending, error } = useQuery({
        queryFn : async()=>{
            return await getAlbumSearches(searchParams.query);
        },
        queryKey : [searchParams.query],
        enabled: !!searchParams.query,
    });

    if (!searchParams.query)
        return null;

    if (isPending) {
        return (
            <div className="w-full h-full flex items-center justify-center pt-32">
                <SyncLoader color="#252525" />
            </div>
        )
    }

    if (!data || data.length===0 || error){
        return (
            <div className="w-full h-full flex items-center justify-center pt-32">
                <h4 className="font-semibold md:text-lg text-center text-zinc-300">No albums found for &quot;{searchParams.query}&quot;</h4>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2 gap-y-4 md:gap-y-8 py-10">
            {
                data.map(({id, payload})=>(
                    <AlbumCard
                        album={payload as Album}
                        key={id}
                        className="w-full h-full"
                    />
                ))
            }
        </div>
    )
}

export default SearchAlbumPage;