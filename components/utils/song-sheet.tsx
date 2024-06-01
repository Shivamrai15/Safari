"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { useQueue } from "@/hooks/use-queue";
import { useSheet } from "@/hooks/use-sheet";
import { cn, songLength } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { FaBackwardStep, FaForwardStep } from "react-icons/fa6";
import { IconType } from "react-icons";
import { LucideIcon, ShuffleIcon } from "lucide-react";
import { LikeButton } from "./like-button";
import { SyncLoader } from "react-spinners";

interface LyricLine {
    time: number;
    text: string;
}

interface SongSheet {
    seekTime : ( num:number ) => void;
    currentTime : number;
    togglePlay : () => void;
    Icon : IconType;
    RepeatIcon : LucideIcon,
    toggleRepeat : () => void;
    active : boolean | undefined
}

export const SongSheet = ({
    seekTime,
    currentTime,
    togglePlay,
    Icon,
    RepeatIcon,
    toggleRepeat,
    active,
} : SongSheet ) => {

    const { isOpen, onClose } = useSheet();
    const { current, deQueue, pop, shuffle } = useQueue();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
    const lyricsContainerRef = useRef<HTMLDivElement | null>(null);


    const handleClose = ( open : boolean ) => {
        if (!open) {
            onClose();
        }
    }

    const fetchLyrics = async( songId : string ) => {
        try {
            setLoading(true);
            setLyrics([]);
            setError("");
            const response = await axios.get(`/api/v1/lyrics?songId=${songId}`);
            setLyrics(response.data.lyrics.lyrics);
        } catch (error) {
            console.log(error);
            setError("Lyrics Not Found");
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if (current) {
            fetchLyrics(current.id);
        }
    }, [current]);


    useEffect(()=>{
        if ( (lyrics.length > 0) && currentTime ) {
            const nextLineIndex = lyrics.findIndex(line => line.time > currentTime) - 1;

                if (nextLineIndex !== currentLineIndex) {
                    setCurrentLineIndex(nextLineIndex);
                    const element = document.getElementById(`lry${nextLineIndex}`);
                    if (element && lyricsContainerRef.current && nextLineIndex>2) {

                        const containerHeight = lyricsContainerRef.current.clientHeight;
                        const elementOffset = element.offsetTop;
                        const elementHeight = element.offsetHeight;

                        const scrollTo = elementOffset - (containerHeight - elementHeight) / 2;

                        lyricsContainerRef.current.scrollTo({
                            top:  scrollTo,
                            behavior: 'smooth'
                        })
                    }
                }
            
        }
        console.log(lyrics.length)
    }, [lyrics, currentTime]);

    return (

        <Sheet open = { isOpen } onOpenChange={handleClose} >
            <SheetContent side="bottom" className="h-full w-full bg-neutral-900 p-0 transition-colors duration-1000 sheet-scroll overflow-y-auto" style={{background : `linear-gradient(200deg, ${current?.album.color}, #121212 )`  }} >
                <div className="md:p-6 w-full h-screen md:px-20 lg:px-28 md:grid md:grid-cols-3 md:gap-10 lg:gap-12 xl:gap-32">
                    <div className="w-full flex flex-col gap-y-4 items-center justify-center h-2/3 md:h-full">
                        <div className="hidden md:block aspect-square w-full h-fit rounded-sm overflow-hidden shadow-2xl relative">
                            <Image
                                src={current?.image || ""}
                                alt={current?.name || "Image"}
                                fill
                                className="object-cover select-none"
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
                                <h3 className="hidden md:block text-lg font-semibold select-none">{current?.album.name}</h3>
                                <div className="flex items-center justify-between gap-x-4">
                                    <h2 className="text-3xl md:text-5xl lg:text-8xl font-bold md:font-extrabold line-clamp-1 drop-shadow-2xl md:py-2 flex-1 select-none" >{current?.name}</h2>
                                    <LikeButton id={current?.id} className="h-8 w-8 md:hidden"/>
                                </div>
                            </div>
                            <div className="md:flex gap-x-6 w-full items-center">
                                <span className="w-10 hidden md:block font-semibold text-center select-none">{songLength(Math.floor(currentTime))}</span>
                                <Slider
                                    value={[currentTime]}
                                    step={1}
                                    max={current?.duration||1}
                                    onValueChange={(e)=>seekTime(e[0])}
                                    className="w-full h-5 md:cursor-pointer"
                                    disabled = { active===false }
                                />
                                <span className="w-10 text-sm hidden md:block font-semibold text-center select-none" >{songLength(current?.duration || 0)}</span>
                                <div className="md:hidden flex items-center justify-between mt-2">
                                    <span className="text-sm text-zinc-200 select-none ">{songLength(Math.floor(currentTime))}</span>
                                    <span className="text-sm text-zinc-200 select-none">{songLength(current?.duration || 0)}</span>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center w-full gap-x-6 md:justify-start">
                                <ShuffleIcon className="md:h-8 md:w-8" onClick={shuffle} />
                                <button
                                    onClick={pop}
                                    disabled = { active===false }
                                >
                                    <FaBackwardStep
                                        className={cn(
                                            "h-8 w-8 md:h-10 md:w-10 text-zinc-300 hover:text-white cursor-pointer",
                                            active === false && "text-zinc-400 hover:text-zinc-400 cursor-not-allowed"
                                        )}
                                    />
                                </button>
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
                            <div className="flex items-center w-full justify-center gap-x-5 md:hidden">
                                <ShuffleIcon className="md:h-8 md:w-8" onClick={shuffle} />
                                <button 
                                    disabled ={active===false}
                                    onClick={pop}
                                >
                                    <FaBackwardStep
                                        className="h-8 w-8 md:h-10 md:w-10 md:text-zinc-300 hover:text-white"
                                    />
                                </button>
                                <Icon
                                    className="h-10 md:h-14 w-10 md:w-14"
                                    onClick={togglePlay}
                                />
                                <FaForwardStep
                                    className="h-8 w-8 md:h-10 md:w-10 md:text-zinc-300 hover:text-white"
                                    onClick={deQueue}
                                />
                                <RepeatIcon onClick={toggleRepeat}  className="h-6 w-6 md:h-8 md:w-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-neutral-950 md:bg-inherit h-screen w-full flex items-center md:items-start justify-center px-6">
                    {
                        loading ? (
                            <div className="h-1/2 flex items-center justify-center">
                                <SyncLoader color="#252525" />
                            </div>
                        ) : error ? (
                            <div className="h-1/2 flex items-center justify-center">
                                <div className="text-xl md:text-3xl font-bold text-white">
                                    {error}
                                </div>
                            </div>
                        ) : (
                            <div
                                className="w-full max-w-4xl h-[80vh] overflow-hidden relative"
                            >
                                <div 
                                    ref={lyricsContainerRef}
                                    className="absolute inset-0 overflow-y-auto lryics_container py-4"
                                >
                                    <div className="flex flex-col items-center gap-y-4 md:gap-y-8">
                                        {lyrics.map((line, index) => (
                                        <p
                                            id={`lry${index}`}
                                            key={index}
                                            className={cn(
                                                "my-2 transition-all duration-500 select-none text-center",
                                                index === currentLineIndex ? 'text-3xl md:text-5xl lg:text-7xl font-extrabold text-white'
                                                : index < currentLineIndex
                                                ? 'text-2xl md:text-4xl lg:text-5xl font-bold text-gray-300'
                                                : 'text-2xl md:text-4xl lg:text-5xl font-bold  text-gray-300'
                                            )}
                                            style={{
                                                opacity: index === currentLineIndex ? 1 : 0.5,
                                            }}
                                        >
                                            {line.text}
                                        </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </SheetContent>
        </Sheet>
    )
}
