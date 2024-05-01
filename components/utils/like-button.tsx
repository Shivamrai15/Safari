"use client";

import { cn } from "@/lib/utils";
import { MdOutlineThumbUpAlt } from "react-icons/md";

interface LikeButtonProps {
    id : string|undefined;
    className? : string;
}

export const LikeButton = ({
    id,
    className
} : LikeButtonProps ) => {
    
    return (
        <MdOutlineThumbUpAlt
            className={cn(
                "h-6 w-6",
                className
            )}
        />
    )
}
