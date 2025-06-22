"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
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
                "w-full bg-neutral-800 rounded-lg hover:bg-neutral-800/70 md:cursor-pointer",
                className
            )}
            onClick={()=>router.push(`/browse/moods/${mood.id}`)}
        >
            <div className="aspect-square w-full relative overflow-hidden rounded-t-lg">
                <Image
                    src={mood.image+""||""}
                    alt={mood.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-white">
                    {mood.name}
                </h3>
            </div>
        </div>
    )
}
