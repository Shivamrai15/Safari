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
            className='w-full relative group overflow-hidden transition-colors md:cursor-pointer'
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
                className="object-cover w-full aspect-[2/3] rounded-2xl md:rounded-3xl brightness-75 group-hover:brightness-100 transition-all"
                loop={true}
            />
            <div className="text-base font-semibold text-center truncate mt-4">
                {name}
            </div>
        </div>
    )
}
