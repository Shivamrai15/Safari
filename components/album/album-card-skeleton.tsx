import { Skeleton } from "@/components/ui/skeleton"

export const AlbumCardSkeleton = () => {
    return (
        <div className="w-36 md:w-44 rounded-md space-y-4 md:cursor-pointer select-none p-3 bg-neutral-900">
            <Skeleton className="w-full aspect-square relative rounded-md bg-neutral-800" />
            <Skeleton className="h-4 w-20 bg-neutral-800"/>
        </div>
    )
}
