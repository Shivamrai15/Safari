"use client";


import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PlayButton } from "../artist/play-button";

interface ArtistCardProps {
    artist : {
        id: string;
        image: string;
        name: string;
    }
    className? : string;
}

export const ArtistCard = ({
    artist,
    className
} : ArtistCardProps ) => {

    const router = useRouter();

    return (
        <div className={cn(
            "aspect-[3/4] w-44 w:h-48 shrink-0 rounded-md space-y-4 cursor-default select-none md:cursor-pointer bg-neutral-900 hover:bg-neutral-900/80 p-4 group",
            className
        )}>
            <div 
                onClick={()=>router.push(`/artist/${artist.id}`)}
                className="aspect-[15/16] relative overflow-hidden shrink-0"
            >
                <Image
                    src={artist.image}
                    fill
                    alt={artist.name}
                    className="object-cover rounded-full"
                />
                <div className="bottom-2 right-0 z-10 absolute opacity-0 group-hover:opacity-100 transition-transform duration-300 translate-y-3 group-hover:translate-y-0" onClick={(e)=>e.stopPropagation()} >
                    <PlayButton artistId={artist.id} songs={[]} className="h-12 w-12 md:h-12 md:w-12 p-3 hover:bg-red-600" />
                </div>
            </div>
            <div>
                <h3 className="font-medium select-none" >{artist.name}</h3>
                <span className="text-sm text-zinc-300 select-none" >Artist</span>
            </div>
        </div>
    )
}
