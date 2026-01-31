"use client";


import { cn } from "@/lib/utils";
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
        <div 
            className={cn(
                "aspect-[3/4] w-44 shrink-0 rounded-md cursor-default select-none md:cursor-pointer bg-neutral-900 hover:bg-neutral-900/80 group overflow-hidden relative",
                className
            )}
            onClick={()=>router.push(`/artist/${artist.id}`)}
        >
            <div
                className="absolute z-10 inset-0 mask"
                style={{ backgroundImage: `url(${artist.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
            </div>
            <div className="overflow-hidden size-full z-10 relative p-3 flex items-end w-full">
                <div className="relative w-full flex items-center gap-2">
                    <div className="w-full">
                        <h3 className="font-medium select-none line-clamp-1" >{artist.name}</h3>
                        <span className="text-sm text-zinc-300 select-none" >Artist</span>
                    </div>
                    <div className="z-10 justify-end items-center hidden group-hover:flex transition-transform duration-300 " onClick={(e)=>e.stopPropagation()} >
                        <PlayButton artistId={artist.id} songs={[]} className="h-10 w-10 md:h-10 md:w-10 p-3 bg-white hover:bg-white/90 text-black" />
                    </div>
                </div>
            </div>
        </div>
    )
}
