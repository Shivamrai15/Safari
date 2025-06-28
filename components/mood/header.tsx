import Image from "next/image";
import { Mood } from "@prisma/client";
import { addCloudinaryTransformations } from "@/lib/utils";
import { PlayButton } from "./play-button";
import { ShuffleButton } from "../utils/shuffle-btn";
import { ShareButton } from ".//share-button";

interface HeaderProps {
    mood : Mood & { _count: { metadata : number } }
}

export const Header = ({
    mood
}: HeaderProps) => {
    return (
        <header className="px-4 md:px-20" style={{background :  `linear-gradient(160deg, ${(mood?.color || "#242424")} 40%, #111 30%)` }} >
            <div className="pt-14 md:pt-20 pb-10">
                <div className="flex flex-col md:flex-row items-center gap-x-8">
                    <div className="relative aspect-square h-44 w-44 lg:h-60 lg:w-60 shadow-xl">
                        <Image
                            fill
                            alt={mood.name}
                            src={addCloudinaryTransformations(mood.image ?? "", "w_800,q_60,f_avif")}
                            className="object-cover rounded-md"
                        />
                    </div>
                    <div
                        className="flex flex-col gap-y-2 mt-4 md:mt-0 text-center md:text-left md:pr-28 select-none cursor-default"
                    >
                        <p className="hidden md:block font-semibold text-sm">
                            Mood
                        </p>
                        <h1 
                            className="text-white text-4xl sm:text-5xl lg:text-8xl font-extrabold line-clamp-1 py-2"
                        >
                            {mood.name}
                        </h1>
                        <div className="font-semibold text-sm flex items-center justify-center md:justify-start">
                            <span>
                                {`${mood._count.metadata} Songs`}
                            </span>
                        </div>
                        <div className="flex justify-center md:justify-start items-center gap-6 pt-2 md:pr-28" >
                            <PlayButton id={mood.id} />
                            <ShuffleButton/>
                            <ShareButton moodId={mood.id} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
