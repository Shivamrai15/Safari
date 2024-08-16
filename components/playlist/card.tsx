"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { LikedPlayButton } from "@/components/song/liked-play-btn";

interface CardProps {
    label : string;
    href : string;
    image : string;
}

export const Card = ({
    label,
    href,
    image,
} : CardProps ) => {

    const router = useRouter();

    return (
        <div 
            onClick={()=>router.push(href)}
            className="sm:max-w-80 w-full flex items-center gap-x-4 bg-neutral-900 hover:bg-neutral-800/80 rounded-sm md:cursor-pointer transition-all overflow-hidden relative group" 
        >
            <div className="aspect-square h-16 shrink-0 overflow-hidden relative shadow-neutral-950 shadow-lg">
                <Image
                    src={image}
                    fill
                    className="object-cover"
                    alt={label}
                />
            </div>
            <div className="w-full overflow-hidden select-none">
                <h3 className="font-semibold line-clamp-1 select-none" >{label}</h3>
            </div>
            {
                label === "Liked Songs" && (
                    <div className="absolute top-0 right-4 h-16 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <LikedPlayButton className="h-10 w-10 md:h-12 md:w-12 shadow-md shadow-neutral-950" />
                    </div>
                )
            }
        </div>
    )
}
