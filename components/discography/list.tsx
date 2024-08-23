"use client";

import { Fragment, useEffect } from "react";
import { useQuery } from "@/hooks/use-query";
import { useInView } from "react-intersection-observer";
import { SyncLoader } from "react-spinners";
import { Album, Song } from "@prisma/client";
import { AlbumSection } from "./album";

interface AlbumsProps {
    artistId: string;
}

interface AlbumType extends Album {
    songs : (Song & {artists : ({ id: string, name: string, image: string })[]})[];
}

export const Lists = ({
    artistId
} : AlbumsProps ) => {


    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useQuery({ url : `/api/v2/artist/discography`, paramKey : "id" , paramValue : artistId, queryKey:artistId });
    const { ref, inView } = useInView();

    useEffect(()=>{
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, inView]);


    if ( status === "pending" ) {
        return (
            <div className="mt-16 md:mt-20 w-full flex items-center justify-center">
                <SyncLoader color="#252525" />
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-y-12 md:gap-y-16">
            {
                    data?.pages.map((group, i)=>(
                        <Fragment key={i} >
                            { group.items.map((album : AlbumType) => (
                                <AlbumSection key={album.id} album={album} />
                            )) }
                        </Fragment>
                    ))
                }
                <div className="h-4 w-full" ref = {ref} />        
                {
                    isFetchingNextPage && (
                        <div className="w-full flex justify-center">
                            <SyncLoader color="#252525" />
                        </div>
                    )
                }
        </div>
    )
}
