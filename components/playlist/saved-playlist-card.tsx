"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface SavedPlaylistCardProps {
    url : string;
    image : string;
    name : string;
    tracks : number;
}

export const SavedPlaylistCard = ({
    url,
    image,
    name,
    tracks 
} : SavedPlaylistCardProps ) => {

    const router = useRouter();

    return (
        <div 
            className='w-full bg-neutral-800/80 p-3 rounded-md hover:bg-neutral-800/70 space-y-4 md:cursor-pointer'
            onClick={()=>router.push(url)}
        >
            <div className="w-full aspect-square rounded-md overflow-hidden relative">
                <Image
                    src={image}
                    fill
                    alt={name}
                />
            </div>
            <div>
                <h3 className='text-white text-base font-semibold w-full line-clamp-1'>{name}</h3>
                <span className="text-sm font-medium text-zinc-300" >{tracks} tracks</span>
            </div>
        </div>
    )
}
