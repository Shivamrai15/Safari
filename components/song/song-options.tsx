"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Album, Artist, PlayList, Song } from "@prisma/client";

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
import { useQueue } from "@/hooks/use-queue";
import { usePlaylist } from "@/hooks/use-playlist";
import { usePlaylistModal } from "@/hooks/use-playlist-modal";

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
    const { data, error, isLoading } : { data : PlayList[], error : any, isLoading : boolean }  = usePlaylist();
    const { mutate } = usePlaylist();
    const { onOpen } = usePlaylistModal();

    useEffect(()=>{
        setOrigin(window.location.origin);
    }, []);

    const handleAddSongInPlaylist = async( playlistId : string )=>{
        try {
            await axios.post(`/api/v1/user/playlist/${playlistId}`, { songId : song.id });
            mutate();
        } catch (error) {
            console.log(error);
        }
    }


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
                                <DropdownMenuItem onClick={()=>onOpen()} >
                                <Plus className="mr-2 h-5 w-5" />
                                <span>New Playlist</span>
                                </DropdownMenuItem>
                                {  (!isLoading && !error )&& data.map((playlist)=>(
                                    <DropdownMenuItem 
                                        key={playlist.id}
                                        onClick={(e)=>{ 
                                            e.stopPropagation();
                                            handleAddSongInPlaylist(playlist.id)
                                        }}
                                    >
                                        <div className="line-clamp-1">
                                            {playlist.name}
                                        </div>
                                    </DropdownMenuItem>
                                )) }
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
