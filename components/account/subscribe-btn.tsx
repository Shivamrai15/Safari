"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscribeBtnProps {
    className? : string;
    color? : string;
    label : string;
    disabled? : boolean; 
    onClick : () => void;
}

export const SubscribeBtn = ({
    className,
    label,
    disabled = false,
    color,
    onClick
} : SubscribeBtnProps ) => {
    
    return (
        <Button className={cn(
                "w-full h-12 rounded-full text-lg font-semibold hover:font-bold transition-all duration-300 text-black",
                className
            )}
            disabled={disabled}
            style={{ backgroundColor : color || "" }}
            onClick={onClick}
        >
            {label}
        </Button>
    )
}
