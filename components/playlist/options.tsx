"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { ListMusic, Pencil, Share, Trash2 } from "lucide-react";
import { SlOptionsVertical } from "react-icons/sl";
import { usePlaylist } from "@/hooks/use-playlist";
import { useRouter } from "next/navigation";
import { Album, Song } from "@prisma/client";
import { useQueue } from "@/hooks/use-queue";
import { useShareModal } from "@/hooks/use-share-modal";
import { AlertModal } from "../modals/alert-modal";

interface PlaylistOptionsProps {
    id : string;
    isPrivate : boolean;
    handleEditModal : () => void;
    disabled : boolean;
    isAuth : boolean;
    name : string;
}

export const PlaylistOptions = ({
    id,
    isPrivate,
    handleEditModal,
    disabled,
    isAuth,
    name
} : PlaylistOptionsProps ) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [ isOpen, setOpen ] = useState(false); 
    const { enQueue } = useQueue();
    const { mutate } = usePlaylist();
    const { onOpen } = useShareModal();

    const addToQueue = async() => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/v1/user/playlist/${id}`);
            const songs : (Song & { album : Album })[] = response.data;
            enQueue(songs);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/v1/user/playlist/${id}`);
            router.push("/");
            mutate();
        } catch (error) {
            if ( axios.isAxiosError(error) ){
                toast.error(`${error.response?.data}`);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                    <SlOptionsVertical className="h-9 w-9 md:cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52 p-1 rounded-sm shadow-lg bg-neutral-800 mt-2" align="start" side="bottom" >
                    <DropdownMenuItem
                        className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                        disabled = { disabled }
                        onClick = {handleEditModal}
                    >
                        <Pencil className="h-5 w-5 mr-3"/>
                        Edit details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer" 
                        disabled = { disabled || !isAuth }
                        onClick={addToQueue}
                    >
                        <ListMusic className="h-5 w-5 mr-3"/>
                        Add to queue
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                        disabled = {disabled || loading}
                        onClick={()=>setOpen(true)}
                    >
                        <Trash2 className="h-5 w-5 mr-3"/>
                        Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                        disabled = {isPrivate}
                        onClick={()=>onOpen(`/playlists/${id}`)}
                    >
                        <Share className="h-5 w-5 mr-3"/>
                        Share
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertModal
                action="Delete"
                description={`Are you sure this will delete "${name}" from your library`}
                title="Delete from your library?"
                onConfirm={handleDelete}
                disabled ={loading}
                setOpen={setOpen}
                isOpen={isOpen}
            />
        </>
    )
}
