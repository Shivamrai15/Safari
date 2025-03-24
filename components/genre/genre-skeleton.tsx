import { Skeleton } from "@/components/ui/skeleton"


export const GenreSkeleton = () => {
    return (
        <Skeleton className="w-full aspect-[2/3] relative group bg-neutral-900 rounded-lg md:rounded-2xl overflow-hidden hover:bg-neutral-800/70 transition-colors cursor-default"/>
    )
}
