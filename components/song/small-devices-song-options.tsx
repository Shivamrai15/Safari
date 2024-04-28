"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Artist, Song } from "@prisma/client";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { Copy, Disc3, EllipsisVertical, Heart, ListMusic, MicVocal, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

interface SmallDevicesSongOptionsProps {
    song : Song & {
        artists : Artist[]
    }
}

export const SmallDevicesSongOptions = ({
    song
} : SmallDevicesSongOptionsProps ) => {

    const router = useRouter();
    const [ origin, setOrigin ] = useState("");
    
    useEffect(()=>{
        setOrigin(window.location.origin);
    }, []);


    return (
        <Drawer>
            <DrawerTrigger onClick={(e)=>e.stopPropagation()} >
                <EllipsisVertical className="md:cursor-pointer" />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <div className="p-4 flex items-center gap-4">
                        <div className="aspect-square h-16 rounded-sm overflow-hidden relative">
                            <Image
                                src={song.image}
                                alt={song.name}
                                fill 
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <h3 className="line-clamp-1 font-semibold"> {song.name} </h3>
                            <div className="text-sm text-zinc-300 line-clamp-1 font-normal overflow-hidden space-x-2" >
                                {
                                    song.artists.map((artist, idx)=>(
                                        <span
                                            key={artist.id}
                                            onClick={()=>router.push(`/artist/${artist.id}`)}
                                            className="hover:underline"
                                        >
                                            {artist.name}{ (idx !== song.artists.length-1)&&"," }
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </DrawerHeader>
                <Separator/>
                <div className="h-72 overflow-y-auto">
                    <div className="flex flex-col space-y-5 p-4 px-8">
                        <div className="flex items-center cursor-pointer">
                            <ListMusic className="mr-3 h-5 w-5" />
                            <span className="font-medium text-base" >Add to queue</span>
                        </div>
                        <div className="flex items-center cursor-pointer">
                            <Plus className="mr-3 h-5 w-5" />
                            <span className="font-medium text-base" >Add to playlist</span>
                        </div>
                        <div className="flex items-center cursor-pointer">
                            <Heart className="mr-3 h-5 w-5" />
                            <span className="font-medium" >Add to Liked Songs</span>
                        </div>
                        <div className="flex items-center cursor-pointer" onClick={()=>navigator.clipboard.writeText(`${origin}/album/${song.albumId}`)} >
                            <Copy className="mr-3 h-5 w-5" />
                            <span className="font-medium" >Copy album link</span>
                        </div>
                        <div className="flex items-center cursor-pointer" onClick={()=>router.push(`/album/${song.albumId}`)} >
                            <Disc3 className="mr-3 h-5 w-5" />
                            <span className="font-medium" >Go to Album</span>
                        </div>
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