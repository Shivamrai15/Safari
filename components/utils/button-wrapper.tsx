"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonWrapperProps {
    className? : string;
    label: string;
    onClick : ()=>void;
    disabled? : boolean;
}

export const ButtonWrapper = ({
    className,
    label,
    disabled = false,
    onClick
} : ButtonWrapperProps ) => {
    return (
        <Button
            className={cn(
                "h-12 px-6 rounded-full bg-red-600 hover:bg-red-600/80 text-white font-semibold",

            )}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </Button>
    )
}
