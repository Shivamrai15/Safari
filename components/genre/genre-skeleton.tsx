import { Skeleton } from "@/components/ui/skeleton"


export const GenreSkeleton = () => {
    return (
        <div className="w-full aspect-[2/3] relative group bg-neutral-900 rounded-lg md:rounded-2xl overflow-hidden hover:bg-neutral-800/70 transition-colors cursor-default">
            <div className="relative flex items-start justify-start w-full p-4 z-10 gap-x-6">
                <Skeleton className="bg-neutral-800 w-1/4 aspect-square flex-shrink-0 relative rounded-md" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-20 md:w-28 lg:w-36 bg-neutral-800"/>
                    <div className="flex items-center gap-x-4">
                        <Skeleton className="size-7 lg:size-10 rounded-full bg-neutral-800"/>
                        <Skeleton className="size-7 lg:size-10 rounded-full bg-neutral-800"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
