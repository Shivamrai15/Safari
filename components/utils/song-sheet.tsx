"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";

import { useQueue } from "@/hooks/use-queue";
import { useSheet } from "@/hooks/use-sheet";
import { cn, songLength } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { FaBackwardStep, FaForwardStep, FaCirclePlay } from "react-icons/fa6";
import { GiMusicalNotes } from "react-icons/gi";
import { BsFillPauseCircleFill } from "react-icons/bs";
import { IconType } from "react-icons";
import { LibraryBig, List, LucideIcon, Rows4, Share, Share2, ShuffleIcon } from "lucide-react";
import { LikeButton } from "./like-button";
import { SyncLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { thumbnailVariants } from "@/lib/variants";
import { BlurFade } from "../ui/blur-fade";
import Link from "next/link";

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
    active : boolean | undefined;
    play : boolean;
    handleOnEnd : ()=>void;
    isAdPlaying : boolean;
}

export const SongSheet = ({
    seekTime,
    currentTime,
    togglePlay,
    Icon,
    RepeatIcon,
    toggleRepeat,
    active,
    play,
    isAdPlaying,
    handleOnEnd
} : SongSheet ) => {

    const { isOpen, onClose } = useSheet();
    const { current, pop, shuffle } = useQueue();
    const [ smOptions, setSmOptions ] = useState(false)
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
    const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const PlayIcon = play ? BsFillPauseCircleFill : FaCirclePlay;

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
        if ( (lyrics.length > 0) && currentTime && active ) {
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
    }, [lyrics, currentTime]);


    const share = async ( url: string , type : "song"|"album"|"artist"|"playlist" ) => {
        if ( navigator ) {
            await navigator.share({
                title : `Check out this ${type} on Safari`,
                url : `${window.location.origin}${url}`
            });
        }
    }

    return (

        <Sheet open = { isOpen } onOpenChange={handleClose} >
            <SheetContent side="bottom" className="h-full w-full bg-neutral-900 p-0 sheet-scroll overflow-y-auto" style={{backgroundColor : isAdPlaying? "#47102d":`${current?.album.color}`, transition: 'background-color 1s ease-in-out' }} >
                <div 
                    className="w-full h-full"
                    style={{ 
                        backgroundColor : isAdPlaying ? "#47102d" : `linear-gradient(-20deg, ${current?.album.color}, ${current?.album.color}, #121212)`,
                        transition: 'background-color 1s ease-in-out'
                    }}    
                >
                    <div className="h-full w-full hidden p-6 px-20 lg:px-28  md:grid md:grid-cols-3 md:gap-10 lg:gap-12 xl:gap-32">
                        <div className="w-full flex flex-col gap-y-4 items-center justify-center h-full">
                            <div className="hidden md:flex aspect-square w-full h-fit rounded-sm overflow-hidden relative items-end justify-end">
                                <motion.div
                                    className="h-full w-full relative shadow-2xl"
                                    variants={thumbnailVariants}
                                    initial="closed"
                                    animate={isOpen ? "open" : "closed"}
                                >
                                    <Image
                                        src={isAdPlaying ? "/assets/ad.avif" : (current?.image || "")}
                                        alt={current?.name || "Image"}
                                        fill
                                        className="object-cover select-none"
                                    />
                                </motion.div>
                            </div>
                        </div>
                        <div className="col-span-2 w-full h-full px-6">
                            <div className="flex flex-col items-center justify-center h-full w-full space-y-10">
                                <div className="w-full text-left pb-4">
                                    <BlurFade delay={0.25} inView>
                                        <h3 className="text-lg font-semibold select-none">{isAdPlaying ? "Safari Ad" : current?.album.name}</h3>
                                    </BlurFade>
                                    <div className="flex items-center justify-between gap-x-4">
                                        <BlurFade delay={0.25} inView>
                                            <h2 className="text-5xl lg:text-8xl font-bold md:font-extrabold line-clamp-1 drop-shadow-2xl flex-1 select-none" >{isAdPlaying ? "End Audio Ads": current?.name}</h2>
                                        </BlurFade>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <BlurFade delay={0.25*2} inView >
                                        <div className="flex gap-x-6 w-full items-center">
                                            <span className="w-10 block font-semibold text-center select-none">{songLength(Math.floor(currentTime))}</span>
                                            <Slider
                                                value={[currentTime]}
                                                step={1}
                                                max={isAdPlaying ? 16 : (current?.duration||1)}
                                                onValueChange={(e)=>seekTime(e[0])}
                                                className={cn(
                                                    "w-full h-5 cursor-pointer",
                                                    active === false && "cursor-not-allowed" 
                                                )}
                                                disabled = { active===false }
                                            />
                                            <span className="w-10 text-sm block font-semibold text-center select-none" >{songLength(isAdPlaying ? 16 : (current?.duration||1))}</span>
                                        </div>
                                    </BlurFade>
                                </div>
                                <div className="w-full ">
                                    <BlurFade delay={0.25*2} inView >
                                        <div className="flex items-center w-full gap-x-6 justify-start">
                                            <ShuffleIcon className="h-8 w-8" onClick={shuffle} />
                                            <button
                                                onClick={pop}
                                                disabled = { active===false }
                                            >
                                                <FaBackwardStep
                                                    className={cn(
                                                        "h-10 w-10 text-zinc-300 hover:text-white cursor-pointer",
                                                        active === false && "text-zinc-400 hover:text-zinc-400 cursor-not-allowed"
                                                    )}
                                                />
                                            </button>
                                            <Icon
                                                className="h-14 w-14 cursor-pointer"
                                                onClick={togglePlay}
                                            />
                                            <button
                                                onClick={handleOnEnd}
                                                disabled = {isAdPlaying}
                                            >
                                                <FaForwardStep
                                                    className="h-10 w-10 text-zinc-300 hover:text-white cursor-pointer"
                                                /> 
                                            </button>
                                            <RepeatIcon onClick={toggleRepeat}  className="h-8 w-8 text-white cursor-pointer" />
                                            <LikeButton id={current?.id} className="h-8 w-8 block" disabled = {isAdPlaying} />
                                        </div>
                                    </BlurFade>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div 
                        className="h-full w-full md:hidden relative bg-cover bg-center backdrop-brightness-50"
                        style={{backgroundImage : `url(${isAdPlaying ? "/assets/ad.avif" : current?.image})`}}
                    >
                        {
                           smOptions && (
                                <div className="h-full w-full z-40 absolute top-0 bg-neutral-900/60 backdrop-blur-md">
                                    <div className="h-full w-full flex flex-col justify-between items-center p-6 sm:px-10">
                                        <div className="w-full pt-24 space-y-10">
                                            <div className="flex items-center w-full gap-x-6">
                                                <div className="h-16 shrink-0 aspect-square rounded-sm overflow-hidden relative">
                                                    <Image
                                                        src={current?.image || ""}
                                                        alt="Image"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div className="">
                                                    <h3 className="select-none line-clamp-1 font-bold">{current?.name}</h3>
                                                    <h2 className="text-sm select-none line-clamp-1">{current?.album.name}</h2>
                                                </div>
                                            </div>
                                            <ul className="space-y-6">
                                                <li className="flex items-center gap-x-3" onClick={()=>share(`/track?id=${current?.id}`, "song")} >
                                                    <Share2 className="h-6 w-6"/>
                                                    <span className="select-none">Share</span>
                                                </li>
                                                <Link
                                                    href={`/album/${current?.album.id}`}
                                                    onClick={()=>{
                                                        setSmOptions(false);
                                                        onClose();
                                                    }}
                                                    className="flex items-center gap-x-3"
                                                >
                                                    <LibraryBig className="h-6 w-6" />
                                                    <span className="select-none">View Album</span>
                                                </Link>
                                                <Link
                                                    href={`/queue`}
                                                    onClick={()=>{
                                                        setSmOptions(false);
                                                        onClose();
                                                    }}
                                                    className="flex items-center gap-x-3"
                                                >
                                                    <Rows4 className="h-6 w-6"/>
                                                    <span className="select-none">Queue</span>
                                                </Link>
                                                <LikeButton id={current?.id} className="h-6 w-6" label />
                                            </ul>
                                        </div>
                                        <div className="w-full flex items-center justify-center">
                                            <Button
                                                variant="ghost"
                                                onClick={()=>setSmOptions(false)}
                                                className="text-red-600 text-lg font-bold"
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <div className="w-full h-full flex items-end  bg-gradient-to-b from-transparent via-black/80 to-neutral-950">
                            <div className="flex flex-col items-center justify-center h-fit space-y-2 px-6 pb-8 w-full">
                                <div className="w-full text-left pb-2">
                                    <div className="flex items-center justify-between gap-x-4">       
                                        <h2 className="text-2xl font-bold line-clamp-1 drop-shadow-2xl flex-1 select-none" >{isAdPlaying ? "End Audio Ads": current?.name}</h2>
                                        <LikeButton id={current?.id} className="h-6 w-6" disabled = {isAdPlaying} />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <Slider
                                        value={[currentTime]}
                                        step={1}
                                        max={isAdPlaying ? 16 : (current?.duration||1)}
                                        onValueChange={(e)=>seekTime(e[0])}
                                        className="w-full h-5 md:cursor-pointer"
                                        disabled = { active===false }
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-200 select-none ">{songLength(Math.floor(currentTime))}</span>
                                        <span className="text-sm text-zinc-200 select-none">{songLength(isAdPlaying ? 16 : (current?.duration||1))}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 w-full items-center justify-items-center">
                                    <div className="flex justify-start w-full">
                                        <ShuffleIcon onClick={shuffle} />
                                    </div>
                                    <div className="flex justify-start w-full" >
                                        <button 
                                            disabled ={active===false}
                                            onClick={pop}
                                        >
                                            <FaBackwardStep
                                                className="h-8 w-8 hover:text-white"
                                            />
                                        </button>
                                    </div>
                                    <PlayIcon
                                        className="h-14 w-14"
                                        onClick={togglePlay}
                                    />
                                    <div className="flex justify-end w-full">
                                        <button
                                            onClick={handleOnEnd}
                                            disabled = { isAdPlaying }
                                        >
                                            <FaForwardStep
                                                className="h-8 w-8 hover:text-white"
                                            />
                                        </button>
                                    </div>
                                    <div className="w-full flex justify-end">
                                        <RepeatIcon onClick={toggleRepeat}  className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <button onClick={()=>setSmOptions(true)}  disabled = {isAdPlaying} >
                                        <List className="h-5 w-5 text-red-500"/>
                                    </button>
                                    <button onClick={()=>share(`/track?id=${current?.id}`, "song")} disabled = {isAdPlaying} >
                                        <Share2 className="h-5 w-5 text-red-500"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cn(
                        "bg-neutral-950 md:bg-inherit h-full w-full flex items-center md:items-start justify-center px-6",
                        smOptions && "hidden",
                        isAdPlaying && "hidden"
                    )}
                >
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
                                        <div className="h-28 w-full" />
                                        {lyrics.map((line, index) => (
                                            <p
                                                id={`lry${index}`}
                                                key={index}
                                                className={cn(
                                                    "my-2 transition-all text-2xl md:text-4xl lg:text-5xl font-bold duration-500 select-none text-center",
                                                    index === currentLineIndex ? 'text-3xl md:text-5xl lg:text-6xl font-extrabold text-white'
                                                    : 'text-gray-300'
                                                )}
                                                style={{
                                                    opacity: index === currentLineIndex ? 1 : 0.6,
                                                }}
                                            >
                                                {line.text === "" ? <GiMusicalNotes className="h-10 w-10 md:h-16 md:w-16"/> : line.text}
                                            </p>
                                        ))}
                                        <div className="h-28 w-full" />
                                    </div>
                                </div>
                                <div 
                                    className="hidden md:block h-full absolute top-0 w-full z-10 "
                                    style={{ background: `linear-gradient(to bottom, ${current?.album.color} 0 10%, transparent 35% 90%, ${current?.album.color}) 90% 100%` }}
                                />
                                <div className="md:hidden h-full absolute top-0 w-full z-10 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950"/>
                                {
                                    active === false && (
                                        <div className="w-full h-full absolute flex items-center justify-center z-20">
                                            <div 
                                                className="max-w-xl w-full rounded-xl bg-neutral-800 shadow-2xl overflow-hidden"
                                            >
                                                <div 
                                                    className="w-full h-full p-6 flex flex-col items-center py-10 space-y-10"
                                                    style={{background : `${current?.album.color}5e`}}
                                                > 
                                                    <p className="text-center text-3xl md:text-4xl lg:text-5xl font-extrabold md:leading-snug lg:leading-snug">
                                                        Enjoy Lyrics only<br />on Safari Premium
                                                    </p>
                                                    <Button
                                                        className="rounded-full font-bold hover:scale-105 transition-transform duration-300"
                                                        onClick={() => {
                                                                router.push('/account/subscription');
                                                                onClose();
                                                            }
                                                        }
                                                    >
                                                        Explore Premium
                                                    </Button> 
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </SheetContent>
        </Sheet>
    )
}
