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
import Link from "next/link";

interface AlbumCarouselProps {
    label : string;
    href : string;
    url? : string
}

export const AlbumCarousel = ({
    href,
    label,
    url 
} : AlbumCarouselProps ) => {

    const {data, isLoading } : { data : Album[], isLoading : boolean } = useAlbum(href); 
    
    if ( !isLoading && data.length === 0 ) {
        return null;
    }

    return (
        <div className="space-y-6 md:space-y-10 w-full">
            <div className="flex items-center justify-between">
                <h3 className="text-xl md:text-3xl font-bold select-none" >{label}</h3>
                {
                    url && (
                        <Link
                            href={url}
                            className="text-zinc-300 font-bold"
                        >
                            Discography
                        </Link>
                    )
                }
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