"use client"

import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";

import { getSubArrays } from '@/lib/utils';
import { Album, Artist, Song } from '@prisma/client';
import { SongCard } from "./song-card";
import { SongCardSkeleton } from "./song-card-skeleton";

interface ListenAgainCarouselProps {
    data : (Song & { album : Album, artists : Artist[] })[];
    loading : boolean;
}

export const ListenAgainCarousel = ({
    data,
    loading
} : ListenAgainCarouselProps ) => {
    
    const songs = getSubArrays(data);
    
    return (
        <div className="space-y-6 md:space-y-10 w-full">
            <h3 className="text-2xl md:text-3xl font-bold select-none" >QuickPicks</h3>
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
                        loading ? (<>
                            <CarouselItem className="basis-auto" >
                                <div className="w-72 md:w-80 space-y-4">
                                    <SongCardSkeleton/>
                                    <SongCardSkeleton/>
                                    <SongCardSkeleton/>
                                    <SongCardSkeleton/>
                                </div>
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <div className="w-72 md:w-80 space-y-4">
                                    <SongCardSkeleton/>
                                    <SongCardSkeleton/>
                                    <SongCardSkeleton/>
                                    <SongCardSkeleton/>
                                </div>
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <div className="w-72 md:w-80 space-y-4">
                                    <SongCardSkeleton/>
                                    <SongCardSkeleton/>
                                </div>
                            </CarouselItem>
                        </>) 
                        : songs.map((songList, i)=>(
                            <CarouselItem key={i} className="basis-auto" >
                                <div className="w-72 md:w-80 space-y-4">
                                    {
                                        songList.map((song)=>(
                                            <SongCard song={song} key={song.id} />
                                        ))
                                    }
                                </div>
                            </CarouselItem>
                        )) 
                    }
                </CarouselContent>
            </Carousel>
        </div>
    )
}
