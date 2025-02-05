"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSongSearches } from "@/server/search";
import { Loader } from "@/components/utils/loader";
import { usePlaylist } from "@/hooks/use-playlist";
import { useDebounce } from "@/hooks/use-debounce";
import { CircleMinus, CirclePlus, Search, X } from "lucide-react";


interface SearchSongsProps {
    playlistId: string;
    onClose: ()=>void;
}

export const SearchSongs = ({
    playlistId,
    onClose
}: SearchSongsProps ) => {

    const router = useRouter();
    const queryClient = useQueryClient();
    const viewRef = useRef<HTMLDivElement>(null);
    const { mutate } = usePlaylist();

    const [ query, setQuery ] = useState("");
    const [loading, setLoading] = useState(false);
    const [ selectedSongs, setSelectedSongs ] = useState<string[]>([]);
    
    const debounceValue = useDebounce(query, 500);
    const { data, error, isPending } = useQuery({
        queryFn : async()=>{
            return await getSongSearches(debounceValue);
        },
        queryKey : [debounceValue],
        enabled : !!debounceValue
    });

    const handleClick = (songId: string)=>{
        if (selectedSongs.includes(songId)) {
            setSelectedSongs((prev)=>(prev.filter((id)=>id!==songId)))
        } else {
            setSelectedSongs((prev)=>([...prev, songId]));
        }
    }


    const handleAddSongs = async()=>{
        try {
            
            setLoading(true);
            await axios.post(`/api/v1/user/playlist/${playlistId}/songs`, { songIds: selectedSongs});
            queryClient.invalidateQueries({ queryKey : [`playlist:${playlistId}`], type:"all" })
            mutate();
            setSelectedSongs([]);
            onClose();
            toast.success("Songs added to playlist");

        } catch (error) {
            console.log("Playlist patch api error", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    

    useEffect(()=>{
        if(viewRef.current) {
            viewRef.current.scrollIntoView({
                behavior : "smooth"
            });
        }
    }, [debounceValue, data]);

    
    return (
        <div className="w-full space-y-10">
            <div className="w-full h-[1px] bg-neutral-700 rounded-lg" />
            <div className="flex items-start gap-x-6 justify-between w-full">
                <div className="flex flex-col gap-y-4 w-full">
                    <h2 className="text-xl md:text-2xl font-bold select-none" >Let&apos;s find something for your playlist</h2>
                    <div className="max-w-md w-full h-12 lg:h-14 flex items-center bg-neutral-800 rounded-full px-4 gap-x-1">
                        <Search/>
                        <Input
                            className="bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-lg"
                            value={query}
                            onChange={(e)=>setQuery(e.target.value)}
                        />
                        {
                            query && <X className="md:cursor-pointer" onClick={()=>setQuery("")} />
                        }
                    </div>
                </div>
                <X className="size-7 md:size-9 md:cursor-pointer" onClick={onClose} />
            </div>
            {
                query && (( isPending )
                ? ( <Loader /> )
                : ( data && data.length !==0 && !error )
                ? (
                    <div className="w-full flex flex-col">
                    {
                        data.map((song)=>(
                            <div
                                key={song.id}
                                className="w-full flex items-center justify-between p-2.5 hover:bg-neutral-800 rounded-md transition-all"
                            >
                                <div className="flex-1 flex items-center gap-x-3">
                                    <div className="size-11 rounded-md relative overflow-hidden">
                                        <Image
                                            src={song.image}
                                            alt={song.name}
                                            className="object-cover"
                                            fill
                                        />
                                    </div>
                                    <div className="w-full">
                                        <h3 className="text-base line-clamp-1 font-medium select-none" >{song.name}</h3>
                                        <div className="text-sm text-zinc-300 line-clamp-1 font-normal overflow-hidden space-x-2" >
                                            {
                                                song.artists.map((artist, idx)=>(
                                                    <span
                                                        key={artist.id}
                                                        onClick={(e)=>{
                                                            e.stopPropagation();
                                                            router.push(`/artist/${artist.id}`);
                                                        }}
                                                        className="hover:underline select-none"
                                                    >
                                                        {artist.name}{ (idx !== song.artists.length-1)&&"," }
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="cursor-default md:cursor-pointer"
                                    onClick={()=>handleClick(song.id)}
                                >
                                    {
                                        selectedSongs.includes(song.id)
                                        ? ( <CircleMinus className="text-red-600 size-6 hover:text-red-500 transition-all" />)
                                        : ( <CirclePlus className="text-zinc-300 hover:text-white size-6 transition-all" /> )
                                    }
                                </Button>
                            </div>
                            ))
                        }
                    </div>
                )
                : (
                    <div className="w-full flex flex-col items-center justify-center pt-10">
                        <Search className="size-8"/>
                        <h3 className="font-semibold select-none mt-3">No songs found</h3>
                        <span className="text-zinc-300 select-none mt-1 text-sm">Check the spelling and try again</span>
                    </div>
                ))
            }
            {
                !!selectedSongs.length && (
                    <div className="w-full bg-gradient-to-b from-transparent via-[#11111198] to-[#111] pt-6 pb-3 sticky bottom-0 flex items-center justify-center">
                        <Button
                            className="w-full max-w-sm h-12 md:h-14 rounded-full font-bold md:text-lg"
                            onClick={handleAddSongs}
                            disabled={loading}
                        >
                            Add {selectedSongs.length} songs
                        </Button>
                    </div>
                )
            }
            <div className='h-0' ref={viewRef} />
        </div>
    )
}
