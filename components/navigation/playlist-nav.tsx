"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { PlayList } from "@prisma/client";
import { usePlaylist } from "@/hooks/use-playlist";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";


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
            <div className="space-y-4 overflow-y-auto flex-1">
                {
                    data.map((playlist)=>(
                        <div  key={playlist.id}>
                            <Tooltip>
                                <TooltipTrigger className="h-10 w-10 py-2" asChild >
                                    <div 
                                        className="h-10 w-10 relative rounded-md overflow-hidden bg-neutral-800 md:cursor-pointer"
                                        onClick={()=>router.push(`/playlists/${playlist.id}`)}
                                    >
                                        <Image
                                            src={playlist?.image || "/assets/playlist.png"}
                                            alt="Playlist"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right"  align="center" className="bg-neutral-800 rounded-sm border-none" style={{ background : playlist.color || "#262626" }}>
                                    <div>
                                        {playlist.name}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ))
                }
            </div>
        </TooltipProvider>
    )
}
