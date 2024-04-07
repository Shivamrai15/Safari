import { Skeleton } from "@/components/ui/skeleton"

export const AlbumCardSkeleton = () => {
    return (
        <div className="aspect-[3/4] h-44 md:h-48 rounded-md space-y-4 cursor-default">
            <Skeleton className="aspect-[15/16] relative rounded-md bg-neutral-800" />
            <Skeleton className="h-4 w-20 bg-neutral-800"/>
        </div>
    )
}
