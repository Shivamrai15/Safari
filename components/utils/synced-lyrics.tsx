"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GiMusicalNotes } from "react-icons/gi";
import { useSheet } from "@/hooks/use-sheet";
import { Button } from "@/components/ui/button";


interface SyncedLyricsProps {
    lyrics : { 
        text: string,
        time : number,
    }[];
    currentTime : number;
    active : boolean | undefined;
    seekTime : ( num:number ) => void;
}


export const SyncedLyrics = ({
    lyrics,
    currentTime,
    active,
    seekTime
}: SyncedLyricsProps) => {
    
    const router = useRouter();
    const { onClose } = useSheet();
    const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
    const lyricsContainerRef = useRef<HTMLDivElement | null>(null);


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

    console.log("Current Line Index:", active);

    return (
        <div
            className="w-full h-full relative bg-neutral-800 py-2 rounded-2xl"
        >
            <div className="h-32 md:hidden absolute top-0 w-full bg-gradient-to-b from-neutral-900/70 to-transparent"/>
            <div 
                className={cn(
                    "max-md:hidden inset-px absolute bg-gradient-to-b z-10 from-neutral-800 via-transparent to-neutral-800 pointer-events-none",
                    active && "pointer-events-none"
                )}
            />
            <div 
                ref={lyricsContainerRef}
                className={cn(
                    "w-full h-full relative overflow-y-auto lyrics-scrollbar py-4",
                    active && "md:pointer-events-auto"
                )}
            >
                <div className="flex flex-col items-start gap-y-4 md:gap-y-8 px-4 md:px-6">
                    <div className="h-12 md:h-28 w-full" />
                    {lyrics.map((line, index) => (
                        <p
                            id={`lry${index}`}
                            key={index}
                            className={cn(
                                "my-1 md:my-2 transition-all text-xl md:text-3xl lg:text-4xl font-bold duration-500 select-none text-left",
                                index === currentLineIndex ? 'text-white'
                                : 'text-gray-300',
                                active && "md:cursor-pointer"
                            )}
                            style={{
                                opacity: index === currentLineIndex ? 1 : 0.6,
                            }}
                            onClick={()=>seekTime(line.time)}
                        >
                            {line.text === "" ? <GiMusicalNotes className="h-8 w-8 md:h-12 md:w-12"/> : line.text}
                        </p>
                    ))}
                    <div className="h-12 md:h-28 w-full" />
                </div>
            </div>
            <div className="h-32 md:hidden absolute top-0 w-full bg-gradient-to-b from-neutral-900/70 to-transparent"/>
            {
                active === false && (
                    <div className="w-full h-full absolute inset-px flex items-center justify-center z-[1000] px-6">
                        <div 
                            className="max-w-xl w-full rounded-xl bg-neutral-900 shadow-2xl overflow-hidden"
                        >
                            <div 
                                className="w-full h-full p-6 flex flex-col items-center py-10 space-y-10"
                            > 
                                <p className="text-center select-none text-3xl md:text-4xl lg:text-5xl font-extrabold md:leading-snug lg:leading-snug">
                                    Enjoy Lyrics only<br />on Safari Premium
                                </p>
                                <Button
                                    className="rounded-full font-bold hover:scale-105 transition-transform duration-300"
                                    onClick={() => {
                                            router.push('/subscription');
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
