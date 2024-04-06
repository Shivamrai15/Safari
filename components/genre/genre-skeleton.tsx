import { Skeleton } from "@/components/ui/skeleton"


export const GenreSkeleton = () => {
    return (
        <div className="w-full p-3 md:p-4 bg-neutral-900 rounded-md space-y-4 hover:bg-neutral-800/70 transition-colors">
            <Skeleton className="bg-neutral-800 aspect-square w-full" />
            <Skeleton className="h-4 w-16 bg-neutral-800"/>
        </div>
    )
}
