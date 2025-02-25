"use client";
import { Video } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { PlayButton } from "./play-button";
import { ShareButton } from "./share-button";

interface GenreProps { 
    id : string
    name : string,
    image : string,
    video : Video|null
}

export const Genre = ({
    id,
    name,
    image,
    video
} : GenreProps ) => {

    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement|null>(null);
    
    if (!video){
        return null;
    }

    return (
        <div
            className='w-full aspect-[2/3] relative group bg-neutral-900 rounded-lg md:rounded-2xl overflow-hidden hover:bg-neutral-800/70 transition-colors md:cursor-pointer'
            onClick={()=>router.push(`/browse/genre/${id}`)}
            onMouseEnter={()=>{
                if (videoRef.current) {
                    videoRef.current.volume=0;
                    videoRef.current.play();
                }
            }}
            onMouseLeave={()=>{
                if(videoRef.current) {
                    videoRef.current.pause();
                }
            }}
        >
            <video
                src={video.url}
                poster={video.image}
                ref={videoRef}
                className="object-cover absolute h-full w-full brightness-[.45] group-hover:brightness-75 transition-all"
                loop={true}
            />
            <div className="relative flex items-start justify-start w-full p-4 z-10 gap-x-6">
                <div className="w-1/4 aspect-square flex-shrink-0 relative rounded-md overflow-hidden drop-shadow-2xl">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="space-y-2">
                    <h1 className="text-xl lg:text-2xl text-white font-bold">
                        {name}
                    </h1>
                    <div className="flex items-center gap-x-4">
                        <PlayButton
                            genreId={id}
                            className="size-9 bg-white p-0"
                        />
                        <ShareButton genreId={id} />
                    </div>
                </div>
            </div>
        </div>
    )
}
