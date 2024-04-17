"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface TopResultWrapperProps {
    url : string;
    image : string;
    name : string;
    children : React.ReactNode;
    className? : string;
    color? : string;
}

export const TopResultWrapper = ({
    image,
    url,
    name,
    children,
    className,
    color
} : TopResultWrapperProps ) => {

    return (
        <div className={cn(
                "p-6 bg-neutral-800 rounded-md md:cursor-default select-none md:w-[32rem]",
                className
            )}
            style={ color ? { background : `linear-gradient( 210deg, ${color}8a, #171717 )` } : {} }
        >
            <div className="flex flex-col md:flex-row gap-5 md:gap-x-10 items-center md:justify-start">
                <div className="flex items-center justify-center">
                    <div className="w-44 aspect-square rounded-full relative overflow-hidden shadow-lg">
                        <Image
                            src={image}
                            fill
                            alt={name}
                            className="object-cover"
                        />
                    </div>
                </div>
                <div>
                    <div className="h-full w-full flex justify-center items-center md:justify-start">
                        <div className="flex flex-col items-center md:items-start">
                            <h2 className="text-xl md:text-2xl font-bold" >{name}</h2>
                            <>
                                {children}
                            </>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
