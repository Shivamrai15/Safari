"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CardProps {
    label : string;
    href : string;
    image : string;
    color : string;
}

export const Card = ({
    label,
    href,
    image,
    color
} : CardProps ) => {

    const router = useRouter();

    return (
        <div 
            onClick={()=>router.push(href)}
            className="sm:max-w-64 w-full flex items-center gap-x-6 p-3 bg-neutral-900 hover:bg-neutral-900/80 rounded-md md:cursor-pointer transition-all" 
            style={{ borderLeftColor : color, borderLeftWidth : "5px" }}
        >
            <div className="aspect-square h-10 shrink-0 rounded-md overflow-hidden relative ">
                <Image
                    src={image}
                    fill
                    className="object-cover"
                    alt={label}
                />
            </div>
            <div className="w-full line-clamp-1 overflow-hidden select-none">
                <h3 className="font-semibold" >{label}</h3>
            </div>
        </div>
    )
}
