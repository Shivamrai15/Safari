"use client";

import { usePlaylist } from "@/hooks/use-playlist";
import { PlayList } from "@prisma/client";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";


export const PlaylistNav = () => {

    const { data, error, isLoading } : { data : PlayList[], error : any, isLoading: boolean } = usePlaylist();
    const router = useRouter();

    if ( isLoading ) {
        return (
            <div className="space-y-4">
                <Skeleton className="bg-neutral-800 rounded-md aspect-square w-full"/>
                <Skeleton className="bg-neutral-800 rounded-md aspect-square w-full"/>
                <Skeleton className="bg-neutral-800 rounded-md aspect-square w-full"/>
            </div>
        )
    }

    if (error) {
        return null;
    }

    return (
        <TooltipProvider>
            <div className="flex flex-col space-y-4 overflow-y-auto">
                {
                    data.map((playlist)=>(
                        <Tooltip key={playlist.id}>
                            <TooltipTrigger className="w-full" asChild >
                                <div 
                                    className="w-full aspect-square relative rounded-md overflow-hidden bg-neutral-800 md:cursor-pointer"
                                    onClick={()=>router.push(`/playlist/${playlist.id}`)}
                                >
                                    <Image
                                        src={playlist?.image || "/assets/playlist.png"}
                                        alt="Playlist"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-neutral-800">
                                <div>
                                    {playlist.name}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    ))
                }
            </div>
        </TooltipProvider>
    )
}
