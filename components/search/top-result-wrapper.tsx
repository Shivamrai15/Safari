"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface TopResultWrapperProps {
    url? : string;
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

    const router = useRouter()

    return (
        <div className={cn(
                "bg-neutral-800 rounded-2xl md:cursor-default select-none md:w-[32rem]",
                className
            )}
            style={ color ? { background : `url("${image}")`,  } : {} }
            onClick={()=>{
                if ( url ) {
                    router.push(url);
                }
            }}
        >
            <div 
                className="w-full h-full backdrop-blur-2xl p-6 bg-gradient-to-b from-transparent to-neutral-900 rounded-2xl overflow-hidden"

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
                                <h2 className="text-xl md:text-2xl font-bold select-none" >{name}</h2>
                                <>
                                    {children}
                                </>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
