"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

interface PreviousButtonProps {
    disabled? : boolean;
}

export const PreviousButton = ({
    disabled = false
} : PreviousButtonProps ) => {
    
    const router = useRouter();

    return (
        <Button
            className="h-14 w-14 rounded-full bg-neutral-800 hover:bg-neutral-800/80 text-zinc-300 hover:text-white"
            disabled = {disabled}
            onClick={()=>router.back()}
        >
            <IoMdArrowRoundBack className="h-8 w-8" />
        </Button>
    )
}
