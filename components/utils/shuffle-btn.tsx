"use client";

import { useQueue } from "@/hooks/use-queue";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { cn } from "@/lib/utils";
import { PiShuffleBold } from "react-icons/pi";


export const ShuffleButton = () => {

    const { shuffle } = useQueue();
    const { connected } = useSocketEvents();

    return (
        <button
            disabled={connected}
            onClick={shuffle}
            className={cn(
                "focus:outline-none outline-none md:cursor-pointer",
                connected && "md:cursor-not-allowed"
            )}
        >
            <PiShuffleBold className="h-12 w-12 md:cursor-pointer" />
        </button>
    )
}
