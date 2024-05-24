"use client";

import { useSession } from "next-auth/react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueue } from "@/hooks/use-queue";
import { Album, Song } from "@prisma/client";
import { ListMusic, Share } from "lucide-react";
import { SlOptionsVertical } from "react-icons/sl";
import { useShareModal } from "@/hooks/use-share-modal";

interface OptionsProps {
    id : string;
    songs : ( Song & { album : Album } )[];
}

export const Options = ({
    id,
    songs
} : OptionsProps ) => {
    
    const session = useSession();
    const { enQueue } = useQueue();
    const { onOpen } = useShareModal();
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
                <SlOptionsVertical className="h-9 w-9 md:cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 p-1 rounded-sm shadow-lg bg-neutral-800 mt-2" align="start" side="bottom" >
                <DropdownMenuItem 
                    className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer" 
                    disabled = { session.status === "unauthenticated" }
                    onClick={()=>enQueue(songs)}
                >
                    <ListMusic className="h-5 w-5 mr-3"/>
                    Add to queue
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    onClick={()=>onOpen(`/album/${id}`)}
                >
                    <Share className="h-5 w-5 mr-3"/>
                    Share
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
