"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Album } from "@prisma/client";
import { SongPlayButton } from "@/components/utils/song-play-button";
import { cn } from "@/lib/utils";

interface AlbumCardProps {
    album : Album;
    className? : string;
}

export const AlbumCard = ({
    album,
    className
} : AlbumCardProps ) => {

    const router = useRouter();

    return (
        <div className={cn(
            "aspect-[3/4] h-48 md:h-52 rounded-md space-y-4 md:cursor-pointer select-none",
            className
        )}>
            <div 
                onClick={()=>router.push(`/album/${album.id}`)}
                className="aspect-[15/16] relative rounded-md overflow-hidden group"
            >
                <Image
                    src={album.image}
                    fill
                    alt={album.name}
                    className="object-cover group-hover:brightness-50 transition-all duration-150"
                />
                <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100">
                        <SongPlayButton
                            className="delay-75 transition opacity-0 duration-300 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 h-12 w-12"
                            id={album.id}
                        />
                    </div>
                </div>
            </div>
            <div className="font-medium line-clamp-1 select-none">
                {album.name}
            </div>
        </div>
    )
}
