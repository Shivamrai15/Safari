import { getAlbumByArtist } from "@/server/artist"
import { AlbumCard } from "../album/album-card";

import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import Link from "next/link";

interface AlbumsProps {
    id : string
}

export const Albums = async({
    id
} : AlbumsProps ) => {

    const albums = await getAlbumByArtist(id);

    return (
        <div className="w-full px-4 md:px-20 mt-20" >
            <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold select-none" >Albums</h3>
                <Link
                    href={`/artist/${id}/discography`}
                    className="text-zinc-300 font-bold select-none"
                >
                    Discography
                </Link>
            </div>
            <Carousel 
                className="w-full space-y-3 mt-10"
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
