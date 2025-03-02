"use client";

import { getMax } from "@/lib/utils";
import { Song } from "@prisma/client";
import { AlbumCarousel } from "./album-carousel";

interface MoreAlbumsProps {
    data : (Song & { artists : {id: string, name : string, image: string}[] })[];
    albumId : string;
}

interface Album { 
    id : string;
    name : string;
    image : string;
}

export const MoreAlbums = ({
    data,
    albumId
} : MoreAlbumsProps) => {
        
    const ids = data.flatMap(song=>song.artistIds);
    const artistId = getMax(ids);
    const artist = data.flatMap(song=>song.artists).find((artist)=>artist.id===artistId);
    
    return (
        <div className="w-full mb-0 px-4 md:px-20 py-10 md:pr-48">
            <AlbumCarousel
                href={`/api/v1/artist/albums?artistId=${artistId}&albumId=${albumId}`}
                label={`More by ${artist?.name}`}
                url={`/artist/${artistId}/discography`}
            />
        </div>
    )
}
