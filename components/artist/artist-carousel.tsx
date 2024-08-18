"use client";

import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import { useSWRQuery } from "@/hooks/use-swr-query";
import { ArtistCard } from "../search/artist-card";
import { ArtistCardSkeleton } from "./artist-card-skeleton";


interface ArtistCarouselProps {
    label : string;
    href : string;
}

export const ArtistCarousel = ({
    href,
    label
} : ArtistCarouselProps ) => {
    
    const  { data, isLoading, error } : { data : { id: string, name: string, image: string }[], isLoading: boolean, error: any } = useSWRQuery(href);

    if ( error ) {
        return (
            <div className="w-full flex items-center justify-center text-center">
                Something went wrong
            </div>
        )
    }

    return (
        <div className="space-y-6 md:space-y-10 w-full">
            <div className="flex items-center justify-between">
                <h3 className="text-xl md:text-2xl font-bold select-none" >{label}</h3>
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
                <CarouselContent className="space-x-2">
                    { isLoading ? (
                        <>
                            <CarouselItem className="basis-auto" >
                                <ArtistCardSkeleton />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <ArtistCardSkeleton />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <ArtistCardSkeleton />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <ArtistCardSkeleton />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <ArtistCardSkeleton />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <ArtistCardSkeleton />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <ArtistCardSkeleton />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <ArtistCardSkeleton />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <ArtistCardSkeleton />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <ArtistCardSkeleton />
                            </CarouselItem>
                        </>
                        ) : data.map((artist) => (
                            <CarouselItem key={artist.id} className="basis-auto" >
                                <ArtistCard artist={artist} />
                            </CarouselItem>
                    )) }
                </CarouselContent>
            </Carousel>
        </div>
    )
}
