"use client";

import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { format , isSameDay} from "date-fns"

import { useQuery } from "@/hooks/use-query";
import { SyncLoader } from "react-spinners";
import { Album, Song, History } from "@prisma/client";
import { SongItem } from "../song/song-item";
import { differenceBetweenHistory, historyPartition } from "@/lib/utils";
import { HistoryHeader } from "./history-header";

export const revalidate = 0;

type ItemType = History & {
    song : Song & { album: Album, artists : { id: string, name: string, image: string }[]}; 
}

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

    if ( data?.pages[0]?.items.length === 0 ) {
        return (
            <div className="pt-16 md:pt-20 w-full flex items-center justify-center text-base font-medium text-zinc-400 select-none">
                No history available to show
            </div>
        )
    }

    console.log(data?.pages);
    
    return (
        <div className="flex flex-col items-center mb-8">
            {
                data?.pages.map((group, i)=>(
                    <Fragment key={i} >
                        { group.items.map((history : ItemType, idx : number ) => (
                            <>
                                {
                                    idx===0 && i===0 && ( isSameDay(new Date(history.createdAt), new Date()) ? 
                                        (<HistoryHeader label="Today" />):
                                        (<HistoryHeader label={differenceBetweenHistory(new Date(), new Date(history.createdAt))} />)
                                    )
                                }
                                <div className="w-full flex items-center justify-start gap-x-6 md:gap-x-10" key={history.song.id} >
                                    <div className="w-1 ml-[22px] h-28 bg-red-500" />
                                    <div className="w-full mt-4">
                                        <span className="text-white text-xs ml-4" >
                                            { format(new Date(history.createdAt), "hh:mm a")}
                                        </span>
                                        <SongItem song={history.song} key={history.song.id} />
                                    </div>
                                </div>
                                {
                                    <HistoryHeader label={historyPartition(data?.pages, i, group.items, idx)} />
                                }
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
