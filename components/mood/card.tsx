"use client";

import { useRouter } from "next/navigation";

import { addCloudinaryTransformations, cn } from "@/lib/utils";
import { Mood } from "@prisma/client";

interface CardProps {
    mood : Mood;
    className?: string;
}

export const Card = ({
    mood,
    className
}: CardProps) => {

    const router = useRouter();

    
    return (
        <div
            className={cn(
                "w-full bg-neutral-800 aspect-[2/1] rounded-lg md:cursor-pointer relative group overflow-hidden",
                className
            )}
            onClick={()=>router.push(`/browse/moods/${mood.id}`)}
            style={{ background: mood.color??"#252525" }}
        >
            <div
                className="absolute w-2/3 right-0 h-full"
                style={{
                    backgroundImage: `url(${addCloudinaryTransformations(mood.image ?? "", "w_800,q_30,f_avif")})`,
                    backgroundSize: "cover",
                    backgroundPosition: "right",
                    zIndex: 0,
                }}
            />
            <div
                className="absolute w-2/3 right-0 h-full"
                style={{
                    backgroundColor: `${mood.color}`,
                    mixBlendMode: 'multiply',
                    zIndex: 1,
                }}
            />
            <div 
                className="absolute w-2/3 right-0 h-full"
                style={{
                    backgroundImage: `linear-gradient(90deg, ${mood.color}, transparent)`,
                    zIndex: 2,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}
            />
            <div className="p-4 z-30 relative flex items-end h-full">
                <h3 className=" text-white text-2xl lg:text-3xl font-extrabold">
                    {mood.name}
                </h3>
            </div>
        </div>
    )
}
