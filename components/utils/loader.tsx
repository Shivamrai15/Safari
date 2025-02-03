import { cn } from "@/lib/utils";
import { SyncLoader } from "react-spinners";

interface LoaderProps {
    className ?: string;
}

export const Loader = ({ className }: LoaderProps) => {
    return (
        <div className={cn(
            "w-full flex items-center justify-center py-20",
            className
        )}>
            <SyncLoader color="#252525" />
        </div>
    )
}
