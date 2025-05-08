"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { getArchivedPlaylists } from "@/server/account";
import { Loader } from "@/components/utils/loader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

export const RecoverPlaylist = () => {
    
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const { data, isPending, error } = useQuery({
        queryFn : async()=>{
            return await getArchivedPlaylists();
        },
        queryKey : ["recover-playlist"]
    });

    const handleRestore = async(id: string)=>{
        try {

            setLoading(true);
            await axios.patch(`/api/v1/user/playlist/${id}/restore`);
            await queryClient.invalidateQueries({
                queryKey : ["recover-playlist"]
            })
            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    if (error && (!data || !data?.success)) {
        return (
            <div className="w-full flex items-center justify-center py-32 font-semibold text-zinc-300 select-none">
                Something went wrong
            </div>
        )
    }

    if (isPending) {
        return (
            <Loader/>
        )
    }

    if (data.data.length === 0 ) {
        return (
            <div className="text-zinc-300 font-medium bg-neutral-800 p-2 px-3 rounded-md select-none">
                You haven’t deleted any playlists
            </div>
        )
    }
    
    return (
        <div className="w-full space-y-8">
            <p className="select-none">You can recover a deleted playlist if it was deleted within the last 90 days. To do this, find the playlist you want to recover and click Restore.</p>
            <div className="w-full flex flex-col gap-y-3">
                <div className="w-full hidden md:grid md:grid-cols-4 px-2 gap-x-4 select-none">
                    <h2 className="font-bold text-zinc-400">Title</h2>
                    <h2 className="font-bold text-zinc-400">Songs</h2>
                    <h2 className="font-bold text-zinc-400">Deleted</h2>
                    <h2 className="font-bold text-zinc-400">Restore</h2>
                </div>
                <div className="h-[1px] bg-neutral-700/90 rounded-md block" />
                {
                    data.data.map((playlist)=>(
                        <>
                            <div className="w-full hidden md:grid md:grid-cols-4 gap-x-4 items-center select-none" key={playlist.id}>
                                <p className="text-zinc-400 font-medium truncate">{playlist.name}</p>
                                <p className="text-zinc-400 font-medium">{playlist._count.songs}</p>
                                <p className="text-zinc-400 font-medium">{ playlist.archivedAt && format(playlist.archivedAt, "dd/MM/yy")}</p>
                                <Button
                                    className="rounded-full w-fit bg-transparent font-medium"
                                    variant="outline"
                                    onClick={()=>handleRestore(playlist.id)}
                                    disabled={loading}
                                >
                                    Restore
                                </Button>
                            </div>
                            <div className="w-full flex items-end gap-x-4 md:hidden select-none" key={playlist.id}>
                                <div className="flex-1">
                                    <div className="flex flex-col">
                                        <p className="text-zinc-400 font-medium truncate">{playlist.name}</p>
                                        <p className="text-zinc-400 font-medium mt-3">{playlist._count.songs}</p>
                                        <p className="text-zinc-400 font-medium">{ playlist.archivedAt && format(playlist.archivedAt, "dd/MM/yy")}</p>
                                    </div>
                                </div>
                                <Button
                                    className="rounded-full w-fit bg-transparent font-medium"
                                    variant="outline"
                                    onClick={()=>handleRestore(playlist.id)}
                                    disabled={loading}
                                >
                                    Restore
                                </Button>
                            </div>
                            <div className="h-[1px] bg-neutral-700/90 rounded-md block" key={playlist.id} />
                        </>
                    ))
                }
            </div>
        </div>
    )
}
