import { albumLength } from "@/lib/utils";
import { Dot } from "lucide-react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { PiShuffleBold } from "react-icons/pi";
import { SlOptionsVertical } from "react-icons/sl";

interface HeaderProps {
    color : string
    image : string,
    name : string,
    songs : number,
    release : Date,
    length : number
}

export const Header = ({
    color,
    image,
    length,
    name,
    songs,
    release
} : HeaderProps ) => {
    return (
        <div className="px-4 md:px-20" style={{background :  `linear-gradient(160deg, ${color} 40%, #111 30%)` }} >
            <div className="pt-14 md:pt-20 pb-10">
                    <div
                        className="flex flex-col md:flex-row items-center gap-x-8"
                    >
                        <div
                            className="relative aspect-square h-44 w-44 lg:h-60 lg:w-60 shadow-xl"
                        >
                            <Image
                                fill
                                alt={name}
                                src={image}
                                className="object-cover rounded-md"
                            />
                        </div>
                        <div
                            className="flex flex-col gap-y-3 mt-4 md:mt-0 text-center sm:text-left"
                        >
                            <p className="hidden md:block font-semibold text-sm">
                                { songs === 1 ? "Single" : "Playlist" }
                            </p>
                            <h1 className="text-white text-4xl sm:text-5xl lg:text-8xl font-extrabold line-clamp-1">
                                {name}
                            </h1>
                            <div className="font-semibold text-sm flex items-center justify-center md:justify-start">
                                <span>
                                    {`${songs} Songs`}
                                </span>
                                <Dot/>
                                <span>
                                    { release.getFullYear() }
                                </span>
                                <Dot/>
                                <span>
                                    { albumLength(length) }
                                </span>
                            </div>
                            <div className="flex justify-center md:justify-start items-center gap-6 pt-2" >
                                <div className="h-12 w-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition cursor-pointer duration-150">
                                    <FaPlay className="h-5 w-5" />
                                </div>
                                <PiShuffleBold className="h-12 w-12 md:cursor-pointer" />
                                <SlOptionsVertical className="h-9 w-9 md:cursor-pointer" />
                            </div>
                        </div>
                    </div>
                    
            </div>
        </div>
    )
}
