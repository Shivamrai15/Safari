"use client";

import { useQuery } from "@tanstack/react-query";
import { SongItem } from "@/components/song/song-item";
import { getSongSearches } from "@/server/search";
import { Album, Song } from "@prisma/client";
import { SyncLoader } from "react-spinners";

interface SongSearchPageProps {
    searchParams : { 
        query : string
    };
}

const SongSearchPage = ({
    searchParams
} : SongSearchPageProps ) => {

    const { data, isPending, error } = useQuery({
        queryFn : async()=>{
            return await getSongSearches(searchParams.query);
        },
        queryKey : [searchParams.query],
        enabled: !!searchParams.query,
    })
    
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
        <div className="w-full py-10 flex flex-col gap-y-1">
            {
                data.map((song : Song & { album : Album, artists  : {id : string, name : string, image: string}[] })=>(
                    <SongItem song={song} key={song.id} />
                ))
            }
        </div>
    )
}

export default SongSearchPage;