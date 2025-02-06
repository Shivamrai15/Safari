"use client";

import { useQuery } from "@/hooks/use-query";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import { SyncLoader } from "react-spinners";
import { List } from "./list";
import { SearchSongs } from "./search-songs";
import { PlaylistSong, Song } from "@/types";


interface SongsProps {
    id : string;
    userId : string;
}

export const Songs = ({
    id,
    userId
} : SongsProps ) => {

    const session = useSession();
    const [findSongs, setFindSongs] = useState(false);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useQuery({ url : "/api/v1/user/playlist/songs", paramKey : "id" , paramValue : id, queryKey:`playlist:${id}` });
    const [playlistSongs, setPlaylistSongs ] = useState<Song[]>([]);

    const { ref, inView } = useInView();

    useEffect(()=>{

        if (inView && hasNextPage) {
            fetchNextPage();
        }

    }, [hasNextPage, inView]);

    useEffect(()=>{
        data?.pages.map((group, i)=>(
            group.items.map((playlistSong : PlaylistSong ) => {
                setPlaylistSongs((prev)=>{
                    if (prev) {
                        const isExist = prev.find((item)=> item.id === playlistSong.songId);
                        if ( isExist ) {
                            return prev;
                        }
                        return [...prev, playlistSong.song];
                    }
                    return [playlistSong.song];
                });
            })
        ))
    }, [data, fetchNextPage]);

    const mutate = ( songId : string ) => {
        if ( playlistSongs ) {
            const filteredSongs = playlistSongs.filter((song)=>song.id!==songId);
            setPlaylistSongs(filteredSongs);
        }
    }

    if ( status === "pending" ) {
        return (
            <div className="mt-16 md:mt-20 w-full flex items-center justify-center">
                <SyncLoader color="#252525" />
            </div>
        )
    }

    if ( status === "error" ) {
        return (
            <div className="mt-16 md:mt-20 w-full flex items-center justify-center text-base font-medium text-zinc-400 select-none">
                Something went wrong
            </div>
        )
    }

    return (
        <div className="mt-10 md:pb-20">
            <List
                songs={playlistSongs}
                isAuth = { session.data?.user?.id === userId }
                playlistId={id}
                mutate={mutate} 
            />
            {
                isFetchingNextPage && (
                    <div className="flex items-center justify-center mt-8">
                        <SyncLoader color="#353535" />
                    </div>
                )
            }
            <div className="h-4 w-full" ref = {ref} />
            <div className="w-full space-y-8 px-4 md:px-20 lg:pr-36 pt-10">
                {
                    findSongs
                    ? (<SearchSongs playlistId={id} onClose={()=>setFindSongs(false)} />)
                    : (
                        <div className="flex items-center justify-end">
                            <div
                                className="text-base select-none font-semibold md:cursor-pointer text-zinc-200 hover:text-white transition-all"
                                onClick={()=>setFindSongs(true)}
                                role="button"
                            >
                                Find more songs
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
