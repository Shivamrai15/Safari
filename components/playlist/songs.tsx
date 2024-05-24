"use client";

import { useQuery } from "@/hooks/use-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { SyncLoader } from "react-spinners";
import { List } from "./list";
import { Album, Artist, Song } from "@prisma/client";
import { useSession } from "next-auth/react";

interface SongsProps {
    id : string;
    userId : string;
}

export const Songs = ({
    id,
    userId
} : SongsProps ) => {

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useQuery({ url : "/api/v1/user/playlist/songs", paramKey : "id" , paramValue : id, queryKey:id });
    const session = useSession();
    const [playlistSongs, setPlaylistSongs ] = useState<(Song & {
        artists : Artist[],
        album : Album
    })[] | null>(null);

    const { ref, inView } = useInView();

    useEffect(()=>{

        if (inView && hasNextPage) {
            fetchNextPage();
        }

    }, [hasNextPage, inView]);

    useEffect(()=>{
        data?.pages.map((group, i)=>(
            group.items.map((song : (Song & {
                artists : Artist[],
                album : Album
            })) => {
                setPlaylistSongs((prev)=>{
                    if (prev) {
                        const isExist = prev.find((item)=> item.id === song.id);
                        if ( isExist ) {
                            return prev;
                        }
                        return [...prev, song];
                    }
                    return [song];
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
        <div className="mt-10 md:pb-10">
            <List
                songs={ playlistSongs || []}
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
        </div>
    )
}
