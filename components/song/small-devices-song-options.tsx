"use client";

import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Album, PlayList, Song } from "@prisma/client";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
    DrawerClose
} from "@/components/ui/drawer";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { 
    Disc3,
    EllipsisVertical,
    ListMusic,
    ListVideo,
    MicVocal,
    Plus,
    Radio,
} from "lucide-react";

import { PiShareFat } from "react-icons/pi";
import { Separator } from "@/components/ui/separator";
import { useQueue } from "@/hooks/use-queue";
import { useSession } from "next-auth/react";
import { usePlaylistModal } from "@/hooks/use-playlist-modal";
import { LikeButton } from "@/components/utils/like-button";
import { usePlaylist } from "@/hooks/use-playlist";
import { toast } from "sonner";
import { useAccount } from "@/hooks/use-account";
import { usePremiumModal } from "@/hooks/use-premium-modal";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvents } from "@/hooks/use-socket-events";
import { ENQUEUE, PLAYNEXT } from "@/lib/events";

interface SmallDevicesSongOptionsProps {
    song : Song & {
        artists : {id : string, name : string, image: string}[],
        album : Album
    }
}

export const SmallDevicesSongOptions = ({
    song
} : SmallDevicesSongOptionsProps ) => {

    const router = useRouter();
    const session = useSession()
    const { enQueue, queue, playNext } = useQueue();
    const { onOpen } = usePlaylistModal();
    const { mutate } = usePlaylist();
    const { data, error, isLoading } : { data : PlayList[], error : any, isLoading : boolean }  = usePlaylist();
    const { onOpenPremiumModal } = usePremiumModal();
    const account = useAccount();

    const socket = useSocket();
    const { connected, roomId } = useSocketEvents();


    const handleAddSongInPlaylist = async( playlistId : string, name : string )=>{
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
        <Drawer>
            <DrawerTrigger onClick={(e)=>e.stopPropagation()} >
                <EllipsisVertical className="md:cursor-pointer" />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <div className="p-4 flex items-center gap-x-4">
                        <div className="aspect-square h-16 shrink-0 rounded-sm overflow-hidden relative">
                            <Image
                                src={song.image}
                                alt={song.name}
                                fill 
                                className="object-cover"
                            />
                        </div>
                        <div className="w-full flex flex-col justify-start items-start">
                            <h3 className="line-clamp-1 font-semibold text-left"> {song.name} </h3>
                            <div className="text-sm text-left line-clamp-1 text-zinc-300 font-normal space-x-2 px-0" >
                                {
                                    song.artists.map((artist, idx)=>(
                                        <span
                                            key={artist.id}
                                            onClick={()=>router.push(`/artist/${artist.id}`)}
                                            className="hover:underline p-0"
                                        >
                                            {artist.name.trimStart()}{ (idx !== song.artists.length-1)&&"," }
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </DrawerHeader>
                <Separator/>
                <div className="h-80 overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
                    <div className="flex flex-col space-y-5 p-4 px-8">
                        <DrawerClose>
                            <button 
                                className="flex items-center w-full"
                                disabled = { session.status === "unauthenticated" }
                                onClick={()=>{
                                    enQueue([song]);
                                    if( connected ) {
                                        socket.emit(ENQUEUE ,{roomId, songs:[song]});
                                    }
                                }}
                            >
                                <ListMusic className="mr-3 h-5 w-5" />
                                <span className="font-medium text-base" >Add to queue</span>
                            </button>
                        </DrawerClose>
                        <DrawerClose>
                            <button 
                                className="flex items-center w-full"
                                disabled = { session.status === "unauthenticated" || queue.length === 0 }
                                onClick={()=>{
                                    playNext(song);
                                    if (connected) {
                                        socket.emit(PLAYNEXT, {roomId, song});
                                    }
                                }}
                            >
                                <ListVideo className="mr-3 h-5 w-5" />
                                <span className="font-medium text-base" >Play Next</span>
                            </button>
                        </DrawerClose>
                        <Accordion type="single" collapsible className="w-full"  >
                            <AccordionItem value={song.id} >
                                <AccordionTrigger className="justify-start no-underline pt-0 pb-4 hover:no-underline" disabled = {session.status === "unauthenticated"} >
                                    <Plus className="mr-3 h-5 w-5" />
                                    <span className="font-medium text-base" >Add to playlist</span>
                                </AccordionTrigger>
                                <AccordionContent className="flex flex-col items-start space-y-2">
                                    <DrawerClose>
                                        <button
                                            disabled={ session.status === "unauthenticated" }
                                            onClick={()=>handleOpenPlaylistModal()}
                                            className="w-full"
                                        >
                                            <span className="font-medium text-base ml-8" >New playlist</span>
                                        </button>
                                    </DrawerClose>
                                    {  (!isLoading && !error )&& data.map((playlist)=>(
                                        <DrawerClose
                                            key={playlist.id}
                                        >
                                            <button
                                                onClick={(e)=>{ 
                                                    e.stopPropagation();
                                                    handleAddSongInPlaylist(playlist.id, playlist.name)
                                                }}
                                                className="w-full"
                                            >
                                                <div className="line-clamp-1 font-medium text-base ml-8">
                                                    {playlist.name}
                                                </div>
                                            </button>
                                        </DrawerClose>
                                    )) }
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <DrawerClose>
                            <button className="flex items-center w-full" disabled = { session.status === "unauthenticated" } >
                                <LikeButton id={song.id} className="h-5 w-5" label={true} />
                            </button>
                        </DrawerClose>
                        <DrawerClose>
                            <button className="flex items-center w-full" onClick={()=>share(`/track?id=${song.id}`, "song")} >
                                <PiShareFat className="mr-3 h-5 w-5" />
                                <span className="font-medium" >Share</span>
                            </button>
                        </DrawerClose>
                        <DrawerClose>
                            <button className="flex items-center w-full" onClick={()=>router.push(`/track?id=${song.id}`)} >
                                <Radio className="mr-3 h-5 w-5" />
                                <span className="font-medium" >Go to song radio</span>
                            </button>
                        </DrawerClose>
                        <DrawerClose>
                            <button className="flex items-center w-full" onClick={()=>router.push(`/album/${song.albumId}`)} >
                                <Disc3 className="mr-3 h-5 w-5" />
                                <span className="font-medium" >Go to Album</span>
                            </button>
                        </DrawerClose>
                    </div>
                    <Separator/>
                    <div className="flex flex-col space-y-5 p-4 px-8">
                        { song.artists.map((artist)=>(
                            <div
                                className="flex items-center cursor-pointer"
                                key={artist.id}
                                onClick={()=>router.push(`/artist/${artist.id}`)}
                            >
                                <MicVocal className="mr-2 h-5 w-5" />
                                <span className="font-medium line-clamp-1" >More from  {artist.name}</span>
                            </div>
                        )) }
                    </div>
                </div>
                
            </DrawerContent>
        </Drawer>
    )
}