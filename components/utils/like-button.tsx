"use client";

import { useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";

import { useLikedSongs } from "@/hooks/use-liked-songs";
import { cn } from "@/lib/utils";
import { MdOutlineThumbUpAlt, MdThumbUp } from "react-icons/md";


interface LikeButtonProps {
    id : string|undefined;
    className? : string;
    label? : boolean;
}

export const LikeButton = ({
    id,
    className,
    label
} : LikeButtonProps ) => {

    const { songIds, addSongId, removeSongId } = useLikedSongs();
    

    const isLiked = useMemo(()=>{
        return songIds.includes(id!);
    }, [id, songIds, addSongId, removeSongId]);


    const toggleLikeButton = async() => {
        try {
            if ( isLiked ) {
                removeSongId(id!);
                toast.success("Removed from Liked Songs");
                await axios.delete(`/api/v1/user/liked-music/${id}`);
            } else {
                addSongId(id!);
                await axios.post("/api/v1/user/liked-music", { id : id });
                toast.success("Added to Liked Songs");
            }

        } catch (error) {
            if ( axios.isAxiosError(error) ){
                toast.error(`${error.response?.data}`);
            } else {
                toast.error("Something went wrong");
            }
        } 
    }

    return (
        <button
            onClick={(e)=>{ 
                e.stopPropagation();
                toggleLikeButton();
            }}
        >
            {
                isLiked ? (
                    <div className="flex items-center" >
                        <MdThumbUp
                            className={cn(
                                "h-6 w-6",
                                className,
                                label && "mr-3"
                            )}
                        />
                        { label && "Remove from liked songs" }
                    </div>
                ) : (
                    <div className="flex items-center" >
                        <MdOutlineThumbUpAlt
                            className={cn(
                                "h-6 w-6",
                                className,
                                label && "mr-3"
                            )}
                        />
                        { label && "Add to liked songs" }
                    </div>
                )
            }
            {label}
        </button>
    )
}
