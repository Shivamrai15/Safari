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

interface PlaylistOptionsProps {
    id : string;
    isPrivate : boolean;
    handleEditModal : () => void;
    disabled : boolean;
    isAuth : boolean;
}

export const PlaylistOptions = ({
    id,
    isPrivate,
    handleEditModal,
    disabled,
    isAuth
} : PlaylistOptionsProps ) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { enQueue } = useQueue();
    const { mutate } = usePlaylist();
    
    const handleSharePlaylist = () => {
        const origin = window.origin;
        const url = `${origin}/playlists/${id}`;
        navigator.clipboard.writeText(url);
        toast.info("Link copied to clipboard")
    }

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
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
                <SlOptionsVertical className="h-9 w-9 md:cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 bg-neutral-900" align="start" side="bottom" >
                <DropdownMenuItem
                    className="py-2"
                    disabled = { disabled }
                    onClick = {handleEditModal}
                >
                    <Pencil className="h-5 w-5 mr-3"/>
                    Edit details
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="py-2" 
                    disabled = { disabled || !isAuth }
                    onClick={addToQueue}
                >
                    <ListMusic className="h-5 w-5 mr-3"/>
                    Add to queue
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="py-2"
                    disabled = {disabled || loading}
                    onClick={handleDelete}
                >
                    <Trash2 className="h-5 w-5 mr-3"/>
                    Delete
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="py-2"
                    disabled = {isPrivate}
                    onClick={handleSharePlaylist}
                >
                    <Share className="h-5 w-5 mr-3"/>
                    Share
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
