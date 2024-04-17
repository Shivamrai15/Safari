"use client";

import { Artist } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ArtistCardProps {
    artist : Artist
}

export const ArtistCard = ({
    artist
} : ArtistCardProps ) => {

    const router = useRouter();

    return (
        <div className="aspect-[3/4] w-44 w:h-48 shrink-0 rounded-md space-y-4 cursor-default select-none md:cursor-pointer bg-neutral-900 hover:bg-neutral-900/80 p-4 ">
            <div 
                onClick={()=>router.push(`/artist/${artist.id}`)}
                className="aspect-[15/16] relative rounded-full overflow-hidden"
            >
                <Image
                    src={artist.image}
                    fill
                    alt={artist.name}
                    className="object-cover"
                />
            </div>
            <div>
                <h3 className="font-medium" >{artist.name}</h3>
                <span className="text-sm text-zinc-300" >Artist</span>
            </div>
        </div>
    )
}
