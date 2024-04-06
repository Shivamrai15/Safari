"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Album } from "@prisma/client";
import { FaPlay } from "react-icons/fa";

interface AlbumCardProps {
    album : Album
}

export const AlbumCard = ({
    album
} : AlbumCardProps ) => {

    const router = useRouter();

    return (
        <div className="aspect-[3/4] h-48 md:h-60 rounded-md space-y-4 md:cursor-pointer">
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
                    <div className="hidden group-hover:block">
                        <button className="rounded-full delay-75 flex items-center transition opacity-0 duration-150 hover:scale-110 group-hover:opacity-100 translate-y-5 group-hover:translate-y-0 justify-center h-12 w-12 bg-red-600">
                            <FaPlay/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="font-medium line-clamp-1">
                {album.name}
            </div>
        </div>
    )
}
