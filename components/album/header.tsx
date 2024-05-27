import { albumLength } from "@/lib/utils";
import { Dot } from "lucide-react";
import Image from "next/image";
import { SongPlayButton } from "@/components/utils/song-play-button";
import { Album, Artist, Song } from "@prisma/client";
import { ShuffleButton } from "@/components/utils/shuffle-btn";
import { Options } from "./options";

interface HeaderProps {
    id : string; 
    color : string;
    image : string;
    name : string;
    songs : number;
    release : Date;
    length : number;
    data : (Song & {
        album : Album,
        artists : Artist[]
    })[];
}

export const Header = ({
    id,
    color,
    image,
    length,
    name,
    songs,
    release,
    data
} : HeaderProps ) => {
    return (
        <div className="px-4 md:px-20" style={{background :  `linear-gradient(160deg, ${color} 40%, #111 30%)` }} >
            <div className="pt-14 md:pt-20 pb-10">
                    <div
                        className="flex flex-col md:flex-row items-center gap-x-8"
                    >
                        <div
                            className="relative shrink-0 aspect-square h-44 w-44 lg:h-60 lg:w-60 shadow-xl"
                        >
                            <Image
                                fill
                                alt={name}
                                src={image}
                                className="object-cover rounded-md"
                            />
                        </div>
                        <div
                            className="flex flex-col gap-y-2 mt-4 md:mt-0 text-center md:text-left md:pr-28"
                        >
                            <p className="hidden md:block font-semibold text-sm select-none">
                                { songs === 1 ? "Single" : "Playlist" }
                            </p>
                            <h1 className="text-white text-4xl sm:text-5xl lg:text-8xl font-extrabold line-clamp-1 md:py-2 overflow-hidden select-none">
                                {name}
                            </h1>
                            <div className="font-semibold text-sm flex items-center justify-center md:justify-start">
                                <span className="select-none">
                                    {`${songs} Songs`}
                                </span>
                                <Dot/>
                                <span className="select-none">
                                    { release.getFullYear() }
                                </span>
                                <Dot/>
                                <span className="select-none">
                                    { albumLength(length) }
                                </span>
                            </div>
                            <div className="flex justify-center md:justify-start items-center gap-6 pt-2 md:pr-28" >
                                <SongPlayButton songs={data} id={id} />
                                <ShuffleButton/>
                                <Options songs={data} id={id} />
                            </div>
                        </div>
                    </div>    
            </div>
        </div>
    )
}
