"use client";


import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";

import { useQueue } from "@/hooks/use-queue";
import { useSheet } from "@/hooks/use-sheet";
import { cn, songLength } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { FaBackwardStep, FaForwardStep, FaCirclePlay } from "react-icons/fa6";
import { BsFillPauseCircleFill } from "react-icons/bs";
import { IconType } from "react-icons";
import { LibraryBig, List, LucideIcon, Rows4, Share2, ShuffleIcon } from "lucide-react";
import { LikeButton } from "./like-button";
import { Button } from "@/components/ui/button";
import { thumbnailVariants } from "@/lib/variants";
import { BlurFade } from "../ui/blur-fade";
import { ArtistCard } from "../artist/artist-card";
import { Ad } from "@prisma/client";
import { LyricsComponent } from "./lyrics";
import { RelatedSongs } from "../song/related-songs";


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
    ad : Ad|null;
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
    handleOnEnd,
    ad
} : SongSheet ) => {

    const { isOpen, onClose } = useSheet();
    const { current, pop, shuffle } = useQueue();
    const [ smOptions, setSmOptions ] = useState(false)
    

    const PlayIcon = play ? BsFillPauseCircleFill : FaCirclePlay;

    const handleClose = ( open : boolean ) => {
        if (!open) {
            onClose();
        }
    }

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
            <SheetContent side="bottom" className="h-full w-full bg-neutral-900 p-0 sheet-scroll overflow-y-auto">
                <div 
                    className="w-full h-full bg-neutral-900"   
                >
                    <div className="h-full w-full hidden p-6 px-10 xl:px-28  md:grid md:grid-cols-3 md:gap-10 lg:gap-12 xl:gap-32">
                        <div className="w-full flex flex-col gap-y-4 items-center justify-center h-full">
                            <div className="hidden md:flex aspect-square w-full h-fit rounded-sm relative items-end justify-end">
                                <motion.div
                                    className="h-full w-full relative shadow-2xl"
                                    variants={thumbnailVariants}
                                    initial="closed"
                                    animate={isOpen ? "open" : "closed"}
                                >
                                    <Image
                                        src={isAdPlaying ? (ad?.image||"") : (current?.image || "")}
                                        alt={current?.name || "Image"}
                                        fill
                                        className="object-cover select-none z-10"
                                    />
                                    <span
                                        className="absolute inset-x-0 top-0 h-0.5 w-4/5 mx-auto z-10"
                                        style={{ background : `linear-gradient(to right, transparent, ${current?.album.color}, transparent)` }}
                                    />
                                    <span
                                        className="absolute inset-x-0 top-0 h-3 mx-auto blur-md"
                                        style={{ background : `linear-gradient(to right, transparent, ${current?.album.color}, transparent)` }}
                                    />
                                </motion.div>
                            </div>
                        </div>
                        <div className="col-span-2 w-full h-full px-6">
                            <div className="flex flex-col items-center justify-center h-full w-full space-y-10">
                                <div className="w-full text-left pb-4">
                                    <BlurFade delay={0.25} inView>
                                        <h3 className="text-lg font-semibold select-none">{isAdPlaying ? `${ad?.name}` : current?.album.name}</h3>
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
                                                max={isAdPlaying ? (ad?.duration||1) : (current?.duration||1)}
                                                onValueChange={(e)=>seekTime(e[0])}
                                                className={cn(
                                                    "w-full h-5 cursor-pointer",
                                                    active === false && "cursor-not-allowed" 
                                                )}
                                                disabled = { active===false }
                                            />
                                            <span className="w-10 text-sm block font-semibold text-center select-none" >{songLength(isAdPlaying ?  (ad?.duration||1) : (current?.duration||1))}</span>
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
                                                className="focus:outline-none"
                                            >
                                                <FaBackwardStep
                                                    className={cn(
                                                        "size-8 lg:size-10 text-zinc-300 hover:text-white cursor-pointer",
                                                        active === false && "text-zinc-400 hover:text-zinc-400 cursor-not-allowed"
                                                    )}
                                                />
                                            </button>
                                            <Icon
                                                className="md:size-11 lg:size-14 cursor-pointer"
                                                onClick={togglePlay}
                                            />
                                            <button
                                                onClick={handleOnEnd}
                                                disabled = {isAdPlaying}
                                                className="focus:outline-none"
                                            >
                                                <FaForwardStep
                                                    className="size-8 lg:size-10 text-zinc-300 hover:text-white cursor-pointer"
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
                        style={{backgroundImage : `url(${isAdPlaying ? `${ad?.image}` : current?.image})`}}
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
                                        max={isAdPlaying ? (ad?.duration||1) : (current?.duration||1)}
                                        onValueChange={(e)=>seekTime(e[0])}
                                        className="w-full h-5 md:cursor-pointer"
                                        disabled = { active===false }
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-200 select-none ">{songLength(Math.floor(currentTime))}</span>
                                        <span className="text-sm text-zinc-200 select-none">{songLength(isAdPlaying ? (ad?.duration||1) : (current?.duration||1))}</span>
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
                                            className="focus:outline-none"
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
                                            className="focus:outline-none"
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
                        "bg-neutral-950 md:bg-inherit min-h-full w-full grid lg:grid-cols-3 px-6 md:px-10 xl:px-28 gap-8 max-md:pt-2",
                        smOptions && "hidden",
                        isAdPlaying && "hidden"
                    )}
                >
                    <div className="w-full h-[70vh] md:h-[90vh] lg:col-span-2 bg-neutral-800 rounded-2xl overflow-hidden ring-1 ring-neutral-700/60">
                        <LyricsComponent
                            active={active}
                            songId={current?.id||""}
                            currentTime={currentTime}
                            seekTime={seekTime}
                        />
                    </div>
                    <div className="w-full h-[90vh] flex flex-col gap-y-4 max-md:pb-10">
                        <ArtistCard songId={current?.id||""}/>
                        <RelatedSongs songId={current?.id||""} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
