"use client";

import { useQuery } from "@/hooks/use-query";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { SyncLoader } from "react-spinners";
import { ListItem } from "@/components/playlist/list-item";
import { Album, Artist, Song } from "@prisma/client";
import { Clock3 } from "lucide-react";

interface SongsProps {
    genreId : string;
}

export const Songs = ({
    genreId
} : SongsProps ) => {
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useQuery({ url : "/api/v1/genre/songs", paramKey : "id" , paramValue : genreId, queryKey:genreId });

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
        <section className="mt-10 md:mt-20 md:pb-1 w-full">
            <div className="w-full space-y-8 px-4 md:px-20 lg:pr-36">
                <div className="grid grid-cols-7 md:grid-cols-11 gap-4 px-4 font-semibold text-zinc-200 md:px-6">
                    <span className="hidden md:block text-lg select-none" >#</span>
                    <div className="col-span-5 select-none">Title</div>
                    <div className="hidden md:block col-span-4 select-none">Album</div>
                    <div className="col-span-2 md:col-span-1"><Clock3/></div>
                </div>
                <div className="space-y-1">
                    {
                        data?.pages.map((group, i)=>(
                            <Fragment key={i} >
                                { group.items.map((song : (Song & {
                                    artists : Artist[],
                                    album : Album
                                }), j : number ) => (
                                    <ListItem key={song.id} song={song} index={(i*10)+(j+1)} />
                                )) }
                            </Fragment>
                        ))
                    }
                    {
                        isFetchingNextPage && (
                            <div className="w-full flex items-center justify-center py-10">
                                <SyncLoader color="#252525" />
                            </div>
                        )
                    }
                    <div className="h-4 w-full" ref = {ref} />
                </div>
            </div>
        </section>
    )
}
