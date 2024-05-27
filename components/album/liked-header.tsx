"use client";
import Image from "next/image";
import { Album, Artist, Song } from "@prisma/client";
import { ShuffleButton } from "@/components/utils/shuffle-btn";
import { PlayButton } from "@/components/utils/user-play-button";
import { useLikedSongs } from "@/hooks/use-liked-songs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueue } from "@/hooks/use-queue";


export const Header = () => {

    const { data, isLoading } : { data  : ( Song & { album : Album, artists : Artist[] } )[], isLoading : boolean } = useLikedSongs();

    return (
        <div className="px-4 md:px-20" style={{background :  `linear-gradient(160deg, #87141b 40%, #111 30%)` }} >
            <div className="pt-14 md:pt-20 pb-10">
                <div
                    className="flex flex-col md:flex-row items-center gap-x-8"
                >
                    <div
                        className="relative aspect-square h-44 w-44 lg:h-60 lg:w-60 shadow-xl"
                    >
                        <Image
                                fill
                                alt="LM"
                                src="/assets/liked-thumb.png"
                                className="object-cover rounded-md"
                            />
                    </div>
                    <div
                        className="flex flex-col gap-y-2 mt-4 md:mt-0 text-center md:text-left md:pr-28"
                    >
                        <p className="hidden md:block font-semibold text-sm select-none">
                            Playlist
                        </p>
                        <h1 className="text-white text-4xl sm:text-5xl lg:text-8xl font-extrabold line-clamp-1 py-2 select-none">
                            Liked Songs
                        </h1>
                        <div className="font-semibold text-sm flex items-center justify-center md:justify-start">
                            { isLoading ? (
                                <Skeleton  className="h-5 w-16 rounded-lg bg-neutral-800" />
                            ) : (
                                <span className="select-none">
                                    { data.length } Songs
                                </span>
                            ) }
                        </div>
                        <div className="flex justify-center md:justify-start items-center gap-6 pt-2 md:pr-28" >
                                <PlayButton songs={data} />
                                <ShuffleButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
