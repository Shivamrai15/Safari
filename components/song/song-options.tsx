"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
    Disc3,
    EllipsisVertical,
    ListMusic,
    ListVideo,
    MicVocal,
    Plus,
    Trash,
} from "lucide-react";
import { PiShareFat } from "react-icons/pi";
import { useQueue } from "@/hooks/use-queue";
import { usePlaylist } from "@/hooks/use-playlist";
import { usePlaylistModal } from "@/hooks/use-playlist-modal";
import { LikeButton } from "@/components/utils/like-button";
import { toast } from "sonner";
import { usePremiumModal } from "@/hooks/use-premium-modal";
import { useAccount } from "@/hooks/use-account";

interface SongOptionsProps {
    song : (Song & {
        artists : {id : string, name : string, image: string}[],
        album : Album
    });
    playlistId? : string;
    isAuth? : boolean;
    onDelete? : ()=>void;
}

export const SongOptions = ({
    song,
    playlistId,
    isAuth,
    onDelete
} : SongOptionsProps ) => {

    const router = useRouter();
    const session = useSession();
    const { enQueue, playNext, queue } = useQueue();
    const { data, error, isLoading } : { data : PlayList[], error : any, isLoading : boolean }  = usePlaylist();
    const { mutate } = usePlaylist();
    const { onOpen } = usePlaylistModal();
    const { onOpenPremiumModal } = usePremiumModal();
    const account = useAccount();

    const handleAddSongInPlaylist = async( playlistId : string, name: string )=>{
        try {
            await axios.post(`/api/v1/user/playlist/${playlistId}`, { songId : song.id });
            toast.success(`Saved to ${name}`);
            mutate();
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenPlaylistModal = () => {
        if ( session.status === "authenticated") {
            // @ts-ignore
            if (  account &&  account.isActive ) {
                onOpen();
            } else {
                if ( data && data.length < 5 ) {
                    onOpen();
                } else {
                    onOpenPremiumModal();
                }
            }
        }
    }

    const share = async ( url: string , type : "song"|"album"|"artist"|"playlist" ) => {
        if ( navigator ) {
            await navigator.share({
                title : `Check out this ${type} on Safari`,
                url : `${window.location.origin}${url}`
            });
        }
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e)=>e.stopPropagation()} >
                <EllipsisVertical className="md:cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-1 rounded-sm shadow-lg bg-neutral-800 " align="end" onClick={(e)=>e.stopPropagation()} >
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        disabled = { session.status === "unauthenticated" }
                        onClick={(e)=>{
                            e.stopPropagation();
                            enQueue([song])
                        }}
                        className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    >
                        <ListMusic className="mr-2 h-5 w-5" />
                        <span className="font-medium" >Add to queue</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled = { session.status === "unauthenticated" || queue.length === 0 }
                        onClick={(e)=>{
                            e.stopPropagation();
                            playNext(song);
                        }}
                        className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    >
                        <ListVideo className="mr-2 h-5 w-5" />
                        <span className="font-medium" >Play Next</span>
                    </DropdownMenuItem>
                    {
                        playlistId  && isAuth && (
                            <DropdownMenuItem
                                className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                                onClick={onDelete}
                            >
                                <Trash className="mr-2 h-5 w-5"/>
                                <span className="font-medium" >Remove from playlist</span>
                            </DropdownMenuItem>
                        )
                    }
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer data-[state=open]:bg-neutral-700">
                            <Plus className="mr-2 h-5 w-5" />
                            <span className="font-medium" >Add to playlist</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-48 bg-neutral-900" onClick={(e)=>e.stopPropagation()} >
                                <DropdownMenuItem 
                                    disabled = { session.status === "unauthenticated" }
                                    onClick={(e)=>{
                                            e.stopPropagation();
                                            handleOpenPlaylistModal();
                                        }
                                    } 
                                    className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                                >
                                <Plus className="mr-2 h-5 w-5" />
                                <span>New Playlist</span>
                                </DropdownMenuItem>
                                {  (!isLoading && !error )&& data.map((playlist)=>(
                                    <DropdownMenuItem 
                                        key={playlist.id}
                                        onClick={(e)=>{ 
                                            e.stopPropagation();
                                            handleAddSongInPlaylist(playlist.id, playlist.name);
                                        }}
                                        className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                                    >
                                        <div className="line-clamp-1">
                                            {playlist.name}
                                        </div>
                                    </DropdownMenuItem>
                                )) }
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem
                        disabled = {session.status === "unauthenticated"}
                        className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    >
                        <LikeButton id={song.id} className="h-5 w-5" label={true} />
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer data-[state=open]:bg-neutral-700">
                            <MicVocal className="mr-2 h-5 w-5" />
                            <span className="font-medium" >Go to Artist</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-48 bg-neutral-900" >
                                {
                                    song.artists.map((artist)=>(
                                        <DropdownMenuItem 
                                            key={artist.id}
                                            onClick={()=>router.push(`/artist/${artist.id}`)}
                                            className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                                        >
                                            {artist.name}
                                        </DropdownMenuItem>
                                    ))
                                }
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem
                        onClick={()=>router.push(`/album/${song.albumId}`)}
                        className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    >
                        <Disc3 className="mr-2 h-5 w-5" />
                        <span className="font-medium" >Go to Album</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={()=>share(`/track?id=${song.id}`, "song")}
                        className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    >
                        <PiShareFat className="mr-2 h-5 w-5"/>
                        <span className="font-medium" >Share</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
