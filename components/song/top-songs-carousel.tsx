"use client";


import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";

import { useTopSongs } from "@/hooks/use-top-songs";
import { Album, Song } from "@prisma/client";
import { TopSongCard } from "./top-song-card";
import { AlbumCardSkeleton } from "../album/album-card-skeleton";


export const TopSongsCarousel = () => {
    
    const { data, isLoading }:{ data : ( Song & { album : Album } )[], isLoading : boolean } = useTopSongs();
    
    return (
        <div className="space-y-6 md:space-y-10 w-full">
            <h3 className="text-2xl md:text-3xl font-bold select-none" >Top Songs</h3>
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

                        </>) : (data.map((song, idx)=>(
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
