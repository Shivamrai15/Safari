"use client";

import { useQuery } from "@/hooks/use-query";
import { Album, Artist, Song } from "@prisma/client";
import { Fragment, useEffect } from "react";
import { SongItem } from "./song-item";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { SyncLoader } from "react-spinners"

interface ArtistSongsProps {
    id : string
}


export const ArtistSongs = ({
    id
} : ArtistSongsProps ) => {

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useQuery({ url : `${process.env.NEXT_PUBLIC_SOCKET_API}/api/v2/artist/songs`, paramKey : "id" , paramValue : id, queryKey:id })

    const { ref, inView } = useInView();

    useEffect(()=>{

        if (inView && hasNextPage) {
            fetchNextPage();
        }

    }, [hasNextPage, inView])

    if ( status === "pending" ) {
        return (
            <div className="mt-16 md:mt-20 w-full flex items-center justify-center">
                <SyncLoader color="#252525" />
            </div>
        )
    }

    if ( status === "error" ) {
        return (
            <div className="mt-16 md:mt-20 w-full flex items-center justify-center text-base font-medium text-zinc-400 select-none">
                Something went wrong
            </div>
        )
    }

    return (
        <div>
            <div className="flex flex-col items-center gap-y-3 mt-16 md:mt-20 mb-8">
                {
                    data?.pages.map((group, i)=>(
                        <Fragment key={i} >
                            { group.items.map((song : (Song & {
                                artists : Artist[],
                                album : Album
                            })) => (
                                <SongItem song={song} key={song.id} />
                            )) }
                        </Fragment>
                    ))
                }
                {
                    isFetchingNextPage && (
                        <div>
                            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                        </div>
                    )
                }
                <div className="h-4 w-full" ref = {ref} />
            </div>
        </div>
    )
}
