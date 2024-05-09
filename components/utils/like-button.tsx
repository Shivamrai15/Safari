"use client";

import { useLikedSongs } from "@/hooks/use-liked-songs";
import { cn } from "@/lib/utils";
import { Album, Song } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { MdOutlineThumbUpAlt, MdThumbUp } from "react-icons/md";
import { toast } from "sonner";

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

    const [ loading, setLoading ] = useState(false);
    const session = useSession();
    
    const { data, isLoading, mutate } : { 
        data : ( Song & { album : Album } )[],
        isLoading : boolean,
        mutate : ()=>void
    } = useLikedSongs();


    const isLiked = useMemo(()=>{
        if (session.status === "authenticated" && !isLoading) {
            const isExist = data.find((song)=> song.id === id)
            if ( isExist ) {
                return true;
            }
            return false;
        }
    }, [data, id, mutate, isLoading, session]);


    const toggleLikeButton = async() => {
        try {

            setLoading(true)
            if ( isLiked ) {
                await axios.delete(`/api/v1/user/liked-music/${id}`);
                toast.success("Removed from Liked Songs")
            } else {
                await axios.post("/api/v1/user/liked-music", { id : id });
                toast.success("Added to Liked Songs")
            }
            mutate();

        } catch (error) {
            if ( axios.isAxiosError(error) ){
                toast.error(`${error.response?.data}`);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={(e)=>{ 
                e.stopPropagation();
                toggleLikeButton();
            }}
            disabled = { loading }
        >
            {
                isLiked ? (
                    <div className="flex items-center" >
                        <MdThumbUp
                            className={cn(
                                "h-6 w-6",
                                className,
                                loading && "opacity-80 cursor-default",
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
                                loading && "opacity-80 cursor-default",
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
