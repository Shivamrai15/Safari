"use client";

import Link from "next/link";

import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";


import { useSWRQuery } from "@/hooks/use-swr-query";
import { Album, Song } from "@prisma/client";
import { TopSongCard } from "./top-song-card";
import { AlbumCardSkeleton } from "../album/album-card-skeleton";


export const TopSongsCarousel = () => {
    
    const { data, isLoading }:{ data : { items : ( Song & { album : Album } )[], nextCursor: string|null}, isLoading : boolean } = useSWRQuery("/api/v1/views");
    
    return (
        <div className="space-y-6 md:space-y-10 w-full">
            <div className="flex items-center justify-between">
                <h3 className="text-xl md:text-2xl font-bold select-none" >Trending Songs</h3>
                <Link
                    href="/track/trending"
                    className="text-zinc-300 font-bold select-none"
                >
                    More
                </Link>
            </div>
            <Carousel 
                className="w-full space-y-3"
                opts = {{
                    align : "start",
                    slidesToScroll : "auto"
                }}
            >
                <div className="h-6 hidden md:block">
                    <CarouselPrevious className="top-0 left-0"/>
                    <CarouselNext className="top-0 left-14"/>
                </div>
                <CarouselContent className="space-x-4 md:space-x-6">
                    {
                        isLoading ? (<>
                            <CarouselItem  className="basis-auto" >
                                <AlbumCardSkeleton/>
                            </CarouselItem>
                            <CarouselItem  className="basis-auto" >
                                <AlbumCardSkeleton/>
                            </CarouselItem>
                            <CarouselItem  className="basis-auto" >
                                <AlbumCardSkeleton/>
                            </CarouselItem>
                            <CarouselItem  className="basis-auto" >
                                <AlbumCardSkeleton/>
                            </CarouselItem>
                            <CarouselItem  className="basis-auto" >
                                <AlbumCardSkeleton/>
                            </CarouselItem>
                            <CarouselItem  className="basis-auto" >
                                <AlbumCardSkeleton/>
                            </CarouselItem>

                        </>) : (data.items.map((song, idx)=>(
                            <CarouselItem key={song.id} className="basis-auto" >
                                <TopSongCard song={song} idx={idx+1} />
                            </CarouselItem>
                        )))
                    }
                </CarouselContent>
            </Carousel>
        </div>
    )
}
