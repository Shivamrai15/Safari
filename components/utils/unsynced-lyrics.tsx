"use client";

interface UnsyncedLyricsProps {
    lyrics: string[];
    active: boolean | undefined;
}

export const UnsyncedLyrics = ({
    lyrics,
    active
}: UnsyncedLyricsProps) => {
    
    return (
        <div className="h-full w-full relative bg-neutral-800 rounded-2xl">
            <div className="h-32 absolute top-0 w-full bg-gradient-to-b from-neutral-900/70 to-transparent"/>
            <div className="h-full w-full lyrics-scrollbar overflow-y-auto">
                <div className="flex flex-col items-start gap-y-1">
                    <div className="h-8 w-full" />
                        {lyrics.map((line, index) => (
                            <span
                                key={index}
                                className="px-4 md:px-6 my-2 text-zinc-100 transition-all text-2xl md:text-3xl font-bold duration-500 select-none text-left"
                            >
                                {line}
                            </span>   
                        ))}
                    <div className="h-8 w-full" />
                </div>
            </div>
            <div className="h-32 absolute bottom-0 w-full bg-gradient-to-b from-transparent to-neutral-900/70"/>
        </div>
    )
}
