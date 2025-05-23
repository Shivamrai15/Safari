"use client";

import { Fragment, useEffect } from "react";
import { Album, Song } from "@prisma/client";
import { useQuery } from "@/hooks/use-query";
import { Card } from "@/components/song/card";
import { useInView } from "react-intersection-observer";
import { SyncLoader } from "react-spinners";
import { motion } from "framer-motion";



const TrendingPage = () => {
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useQuery({ url : `/api/v1/song/trending`, paramKey : "id" , paramValue : "", queryKey:"" });
    
    const { ref, inView } = useInView();

    useEffect(()=>{

        if (inView && hasNextPage) {
            fetchNextPage();
        }

    }, [hasNextPage, inView]);

    if ( status === "pending" ) {
        return (
            <div className="h-full w-full flex items-center justify-center">
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
        <main className="px-4 md:px-20 w-full space-y-10 pb-20 pt-10 md:pt-20 md:pb-10 md:pr-32">
            <header>
                <h1 className="text-xl md:text-2xl font-bold select-none">
                    Currently Trending Songs
                </h1>
            </header>
            <motion.section 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 gap-y-4 md:gap-y-8"
                transition={{
                    staggerChildren : 0.7,
                    delayChildren : 0.3
                }}
            >
                {
                    data?.pages.map((group, i)=>(
                        <Fragment key={i}>
                            {
                                group.items.map((song : Song & { album: Album } )=>(
                                    <motion.div
                                        className="w-full"
                                        initial={{
                                            opacity: 0,
                                            y: 8
                                        }}
                                        transition={{
                                            duration: 0.3
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        key={song.id}
                                    >
                                        <Card
                                            song={song}
                                        />
                                    </motion.div>
                                ))
                            }
                        </Fragment>
                    ))
                }
            </motion.section>
            {
                isFetchingNextPage && (
                    <div className="mt-8 w-full flex items-center justify-center">
                        <SyncLoader color="#252525" />
                    </div>
                )
            }
            <div className="h-4 w-full" ref = {ref} />
        </main>
    )
}

export default TrendingPage