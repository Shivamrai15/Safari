import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";

interface ErrorProps {
    className ?: string 
}

export const Error = ({
    className
}: ErrorProps ) => {
    
    return (
        <div className={cn(
                "h-full w-full flex flex-col items-center justify-center py-4 space-y-2",
                className             
            )}
        >
            <CircleAlert className="size-7" />
            <p className="text-base font-semibold text-zinc-300 select-none">Something went wrong</p>
        </div>
    )
}
