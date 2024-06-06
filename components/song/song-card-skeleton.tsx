"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const SongCardSkeleton = () => {
    return (
        <div className="w-full bg-neutral-900 hover:bg-neutral-800/90 transition-all rounded-sm group p-2">
            <div className="flex items-center gap-x-4">
                <Skeleton className="h-12 w-12 shrink-0 text-zinc-600"/>
                <div className="w-full relative space-y-1">
                    <Skeleton className="h-5 w-28 md:w-40 text-zinc-600"/>
                    <Skeleton className="h-3 w-40 md:w-56 text-zinc-600"/>
                </div>
            </div>
        </div>
    )
}
