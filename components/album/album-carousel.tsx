"use client";

import { useAlbum } from "@/hooks/use-album";
import { Album } from "@prisma/client";
import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import { AlbumCard } from "./album-card";
import { AlbumCardSkeleton } from "./album-card-skeleton";

interface AlbumCarouselProps {
    label : string,
    href : string
}

export const AlbumCarousel = ({
    href,
    label
} : AlbumCarouselProps ) => {

    const {data, isLoading } : { data : Album[], isLoading : boolean } = useAlbum(href);  

    return (
        <div className="space-y-6 md:space-y-10 w-full">
            <h3 className="text-2xl md:text-3xl font-bold" >{label}</h3>
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
                <CarouselContent className="space-x-4">
                    { isLoading ? (
                        <>
                            <CarouselItem className="basis-auto" >
                                <AlbumCardSkeleton  />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <AlbumCardSkeleton  />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <AlbumCardSkeleton  />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <AlbumCardSkeleton  />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <AlbumCardSkeleton  />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <AlbumCardSkeleton  />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <AlbumCardSkeleton  />
                            </CarouselItem>
                            <CarouselItem className="basis-auto" >
                                <AlbumCardSkeleton  />
                            </CarouselItem>
                        </>
                        ) : data.map((album) => (
                            <CarouselItem key={album.id} className="basis-auto" >
                                <AlbumCard album={album} />
                            </CarouselItem>
                    )) }
                </CarouselContent>
            </Carousel>
        </div>
    )
}