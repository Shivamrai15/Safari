"use client";

import { cn } from "@/lib/utils";
import { AiMusicIcon } from "./icons";
import { useControls } from "@/hooks/use-controls";

interface Props {
    className?: string;
}

export const AiShuffleButton = ({ className }: Props) => {
    const { aiShuffle, setAiShuffle } = useControls();

    
    return (
        <button
            onClick={() => setAiShuffle(!aiShuffle)}
            className={cn(
                "focus:outline-none border-none fill-white md:cursor-pointer size-6",
                className,
                aiShuffle && "fill-red-500"
            )}
        >
            <AiMusicIcon/>
        </button>
    )
}
