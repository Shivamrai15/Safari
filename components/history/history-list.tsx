"use client";

import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@/hooks/use-query";
import { SyncLoader } from "react-spinners";
import { Album, Artist, Song } from "@prisma/client";
import { SongItem } from "../song/song-item";
import { HistoryHeader } from "./history-header";

export const HistoryList = () => {
    
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useQuery({ url : "/api/v1/user/history", paramKey : "id" , paramValue : "", queryKey:"" });

    const { ref, inView } = useInView();

    useEffect(()=>{

        if (inView && hasNextPage) {
            fetchNextPage();
        }

    }, [hasNextPage, inView]);

    if ( status === "pending" ) {
        return (
            <div className="pt-16 md:pt-20 w-full flex items-center justify-center">
                <SyncLoader color="#252525" />
            </div>
        )
    }

    if ( status === "error" ) {
        return (
            <div className="pt-16 md:pt-20 w-full flex items-center justify-center text-base font-medium text-zinc-400 select-none">
                Something went wrong
            </div>
        )
    }
    
    return (
        <div className="flex flex-col items-center mt-12 md:mt-20 mb-8">
            {
                data?.pages.map((group, i)=>(
                    <Fragment key={i} >
                        { group.items.map((song : (Song & {
                            artists : Artist[],
                            album : Album,
                            history : Date
                        }), idx : number ) => (
                            <>
                                {
                                    idx===0 && i===0 && (new Date(song.history).getDate() === new Date().getDate()) && (
                                        <HistoryHeader label="Today" />
                                    )
                                }
                                <div className="w-full flex items-center justify-start gap-x-6 md:gap-x-10" key={song.id} >
                                    <div className="w-1 ml-[22px] h-28 bg-red-500" />
                                    <div className="w-full mt-4">
                                        <span className="text-white text-xs ml-4" >{`${song.history}`}</span>
                                        <SongItem song={song} key={song.id} />
                                    </div>
                                </div>
                            </>
                        )) }
                    </Fragment>
                ))
            }
            {
                isFetchingNextPage && (
                    <div className="mt-8">
                        <SyncLoader color="#252525" />
                    </div>
                )
            }
            <div className="h-4 w-full" ref = {ref} />
        </div>
    )
}
