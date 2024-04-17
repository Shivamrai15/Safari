"use client";

import { Artist } from "@prisma/client";
import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import { ArtistCard } from "./artist-card";

interface ArtistCarouselProps {
    artists : Artist[]
}

export const ArtistCarousel = ({
    artists
} : ArtistCarouselProps ) => {
    return (
        <div className="w-full" >
            <Carousel 
                className="w-full space-y-3 mt-10"
                opts = {{
                    align : "start",
                    slidesToScroll : "auto"
                }}
            >
                <CarouselContent className="space-x-4">
                    {
                        artists.map((artist) => (
                            <CarouselItem key={artist.id} className="basis-auto" >
                                <ArtistCard artist={artist} />
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
            </Carousel>
        </div>
    )
}
