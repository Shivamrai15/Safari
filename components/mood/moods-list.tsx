"use client";

import { Fragment, useEffect } from "react";
import { Loader } from "../utils/loader";
import { Card } from "./card";
import { useQuery } from "@/hooks/use-query";
import { useInView } from "react-intersection-observer";
import { Mood } from "@prisma/client";

export const MoodsList = () => {
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useQuery({
        url : "/api/v1/moods",
        paramKey : "",
        paramValue : "",
        queryKey : "moods",
    });

    const { ref, inView } = useInView();

    useEffect(()=>{
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, inView])

    if (status === "pending") {
        return (
            <Loader/>
        )
    }

    if (status === "error") {
        return (
            <div className="w-full text-center select-none">
                <p className="text-zinc-500 font-semibold">Error loading moods</p>
            </div>
        )
    }
    
    return (
        <div className="w-full">
            <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {
                    data?.pages.map((group, i)=>(
                        <Fragment key={i} >
                            {
                                group.items.map((mood : Mood )=>(
                                    <Card
                                        mood={mood}
                                        key={mood.id}
                                    />
                                ))
                            }
                        </Fragment>
                    ))
                }
            </div>
            {
                isFetchingNextPage && (
                    <Loader className="pt-6" />
                )
            }
            <div className="h-4 w-full" ref={ref} />
        </div>
    )
}
