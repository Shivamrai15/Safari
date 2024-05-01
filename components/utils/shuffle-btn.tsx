"use client";

import { useQueue } from "@/hooks/use-queue";
import { PiShuffleBold } from "react-icons/pi";


export const ShuffleButton = () => {

    const { shuffle } = useQueue();

    return (
        <PiShuffleBold className="h-12 w-12 md:cursor-pointer" onClick={shuffle} />
    )
}
