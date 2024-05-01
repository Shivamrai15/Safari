"use client"

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { useQueue } from "@/hooks/use-queue";
import { useSheet } from "@/hooks/use-sheet";
import { songLength } from "@/lib/utils";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { FaBackwardStep, FaForwardStep } from "react-icons/fa6";
import { IconType } from "react-icons";
import { LucideIcon, ShuffleIcon } from "lucide-react";
import { LikeButton } from "./like-button";

interface SongSheet {
    seekTime : ( num:number ) => void;
    currentTime : number;
    togglePlay : () => void;
    Icon : IconType;
    RepeatIcon : LucideIcon,
    toggleRepeat : () => void;
}

export const SongSheet = ({
    seekTime,
    currentTime,
    togglePlay,
    Icon,
    RepeatIcon,
    toggleRepeat
} : SongSheet ) => {

    const { isOpen, onClose } = useSheet();
    const { current, deQueue, pop, shuffle } = useQueue();

    const handleClose = ( open : boolean ) => {
        if (!open) {
            onClose();
        }
    }

    return (

        <Sheet open = { isOpen } onOpenChange={handleClose} >
            <SheetContent side="bottom" className="h-full w-full bg-neutral-900 p-0 transition-colors duration-1000" style={{background : `linear-gradient(200deg, ${current?.album.color}, #121212 )`  }} >
                <div className="md:p-6 w-full h-full md:px-20 lg:px-28 md:grid md:grid-cols-3 md:gap-10 lg:gap-12 xl:gap-32">
                    <div className="w-full flex flex-col gap-y-4 items-center justify-center h-2/3 md:h-full">
                        <div className="hidden md:block aspect-square w-full h-fit rounded-full overflow-hidden shadow-2xl relative">
                            <Image
                                src={current?.image || ""}
                                alt={current?.name || "Image"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="h-full w-full md:hidden" style={{
                            background : `url(${current?.image})`,
                            backgroundSize : "cover",
                            backgroundRepeat : "no-repeat",
                            backgroundPosition : "center"
                        }
                        } >
                            <div className="h-full bg-gradient-to-b from-transparent to-neutral-950"/>
                        </div>
                    </div>
                    <div className="md:col-span-2 w-full h-1/3 bg-neutral-950 md:bg-transparent md:h-full px-6">
                        <div className="flex flex-col items-center justify-center h-full w-full space-y-4 md:space-y-10">
                            <div className="w-full text-left pb-4">
                                <h3 className="hidden md:block text-lg font-semibold">{current?.album.name}</h3>
                                <div className="flex items-center justify-between gap-x-4">
                                    <h2 className="text-3xl md:text-5xl lg:text-8xl font-bold md:font-extrabold line-clamp-1 drop-shadow-2xl md:py-2 flex-1" >{current?.name}</h2>
                                    <LikeButton id={current?.id} className="h-9 w-9 md:hidden"/>
                                </div>
                            </div>
                            <div className="md:flex gap-x-6 w-full items-center">
                                <span className="w-10 hidden md:block font-semibold text-center">{songLength(Math.floor(currentTime))}</span>
                                <Slider
                                    value={[currentTime]}
                                    step={1}
                                    max={current?.duration||1}
                                    onValueChange={(e)=>seekTime(e[0])}
                                    className="w-full"
                                />
                                <span className="w-10 text-sm hidden md:block font-semibold text-center" >{songLength(current?.duration || 0)}</span>
                                <div className="md:hidden flex items-center justify-between mt-2">
                                    <span className="text-sm text-zinc-200">{songLength(Math.floor(currentTime))}</span>
                                    <span className="text-sm text-zinc-200">{songLength(current?.duration || 0)}</span>
                                </div>
                            </div>
                            <div className="flex items-center w-full justify-center gap-x-5 md:gap-x-6 md:justify-start">
                                <ShuffleIcon className="md:h-8 md:w-8" onClick={shuffle} />
                                <FaBackwardStep
                                    className="h-8 w-8 md:h-10 md:w-10 md:text-zinc-300 hover:text-white cursor-pointer"
                                    onClick={pop}
                                />
                                <Icon
                                    className="h-10 md:h-14 w-10 md:w-14 cursor-pointer"
                                    onClick={togglePlay}
                                />
                                <FaForwardStep
                                    className="h-8 w-8 md:h-10 md:w-10 md:text-zinc-300 hover:text-white cursor-pointer"
                                    onClick={deQueue}
                                />
                                <RepeatIcon onClick={toggleRepeat}  className="h-6 w-6 md:h-8 md:w-8 text-white cursor-pointer" />
                                <LikeButton id={current?.id} className="h-8 w-8 hidden md:block"/>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
