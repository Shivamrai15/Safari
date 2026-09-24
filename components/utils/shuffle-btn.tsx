"use client";

import { useQueue } from "@/hooks/use-queue";
import { PiShuffleBold } from "react-icons/pi";


export const ShuffleButton = () => {

    const { shuffle } = useQueue();

    return (
        <button
            onClick={shuffle}
            className="focus:outline-none outline-none md:cursor-pointer"
        >
            <PiShuffleBold className="h-12 w-12 md:cursor-pointer" />
        </button>
    )
}
