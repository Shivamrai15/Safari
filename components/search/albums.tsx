import { AlbumCard } from "../album/album-card";
import { Album } from "@prisma/client";

import { 
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

interface AlbumsProps {
    albums : Album[]
}

export const Albums = async({
    albums
} : AlbumsProps ) => {

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
                        albums.map((album) => (
                            <CarouselItem key={album.id} className="basis-auto" >
                                <AlbumCard album={album} />
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
            </Carousel>
        </div>
    )
}
