"use client";

import { useRouter } from "next/navigation";
import { Album, Artist, Song } from "@prisma/client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import {
    Copy,
    Disc3,
    EllipsisVertical,
    Heart,
    ListMusic,
    MicVocal,
    Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQueue } from "@/hooks/use-queue";

interface SongOptionsProps {
    song : (Song & {
        artists : Artist[],
        album : Album
    });
}

export const SongOptions = ({
    song
} : SongOptionsProps ) => {

    const router = useRouter();
    const [ origin, setOrigin ] = useState("");
    const { enQueue } = useQueue();
    
    useEffect(()=>{
        setOrigin(window.location.origin);
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e)=>e.stopPropagation()} >
                <EllipsisVertical className="md:cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" >
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={(e)=>{
                        e.stopPropagation();
                        enQueue([song])
                    }}>
                        <ListMusic className="mr-2 h-5 w-5" />
                        <span className="font-medium" >Add to queue</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Plus className="mr-2 h-5 w-5" />
                            <span className="font-medium" >Add to playlist</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-48" >
                                <DropdownMenuItem>
                                <Plus className="mr-2 h-5 w-5" />
                                <span>New Playlist</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                        <Heart className="mr-2 h-5 w-5" />
                        <span className="font-medium" >Add to Liked Songs</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <MicVocal className="mr-2 h-5 w-5" />
                            <span className="font-medium" >Go to Artist</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-48" >
                                {
                                    song.artists.map((artist)=>(
                                        <DropdownMenuItem key={artist.id} onClick={()=>router.push(`/artist/${artist.id}`)} >
                                            {artist.name}
                                        </DropdownMenuItem>
                                    ))
                                }
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem onClick={()=>router.push(`/album/${song.albumId}`)} >
                        <Disc3 className="mr-2 h-5 w-5" />
                        <span className="font-medium" >Go to Album</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>navigator.clipboard.writeText(`${origin}/album/${song.albumId}`)} >
                        <Copy className="mr-2 h-5 w-5"/>
                        <span className="font-medium" >Copy album link</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
