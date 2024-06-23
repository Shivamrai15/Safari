"use client";
import Image from "next/image";
import { ShuffleButton } from "@/components/utils/shuffle-btn";
import { PlayButton } from "./play-button";
import { ShareButton } from "./share-button";

interface HeaderProps {
    id : string;
    image : string;
    name : string;
    count : number;
    color : string;
}

export const Header = ({
    id,
    color,
    count,
    image,
    name
} : HeaderProps ) => {
    return (
        <header className="px-4 md:px-20" style={{background :  `linear-gradient(160deg, ${color} 40%, #111 30%)` }} >
            <div className="pt-14 md:pt-20 pb-10">
                <div className="flex flex-col md:flex-row items-center gap-x-8">
                    <div className="relative shrink-0 aspect-square h-44 w-44 lg:h-60 lg:w-60 shadow-xl">
                        <Image
                            fill
                            alt={name}
                            src={image}
                            className="object-cover rounded-md"
                        />
                    </div>
                    <div className="flex flex-col gap-y-2 mt-4 md:mt-0 text-center md:text-left md:pr-28">
                        <p className="hidden md:block font-semibold text-sm select-none">
                            Genre
                        </p>
                        <h1 className="text-white text-4xl sm:text-5xl lg:text-8xl font-extrabold line-clamp-1 md:py-2 overflow-hidden select-none">
                            {name}
                        </h1>
                        <div className="font-semibold text-sm flex items-center justify-center md:justify-start">
                            <span className="select-none">
                                {`${count} Songs`}
                            </span>
                        </div>
                        <div className="flex justify-center md:justify-start items-center gap-6 pt-2 md:pr-28" >
                            <PlayButton genreId={id} />
                            <ShuffleButton/>
                            <ShareButton genreId={id} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
