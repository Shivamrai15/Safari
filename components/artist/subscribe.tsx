"use client";

import { cn, subscriber } from "@/lib/utils";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { useSubscribers } from "@/hooks/use-subscribers";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface SubscribeProps {
    artistId : string;
    followers ?: number;
    className ?: string;
}

export const Subscribe = ({
    artistId,
    followers,
    className
} : SubscribeProps ) => {

    const session = useSession();
    const [ subscribers, setSubscribers ] = useState(followers||0)
    const [loading, setLoading] = useState(false);

    const  { data, isLoading, mutate } = useSubscribers();
    
    const isFollowing = useMemo(()=> {
        if ( session.status === "unauthenticated" ) return false;
        if ( isLoading ) return false;
        return data.find((artist : { id : string; name : string; image : string })=>artist.id === artistId); 
    }, [data, isLoading, mutate, session]);
    

    const handleSubscribe = async () => {
        try {
            setLoading(true);
            if ( isFollowing ) {
                setSubscribers((prev)=>prev-1);
                await axios.patch("/api/v1/user/unsubscribe", { artistId });
                mutate();
            } else {
                setSubscribers((prev)=>prev+1);
                await axios.patch("/api/v1/user/subscribe", { artistId });
                mutate();
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="outline"
            className={cn(
                "rounded-full hover:border-white font-semibold border-zinc-200 text-zinc-200 cursor-default md:cursor-pointer gap-x-2",
                isFollowing && "text-zinc-100 border-zinc-100",
                className
            )}
            disabled = { session.status === "unauthenticated" || loading || isLoading }
            onClick={(e)=>{
                e.stopPropagation();
                handleSubscribe();
            }}
            type="button"
        >
            <span className="block" >{ isFollowing ? "Unsubscribe" : "Subscribe" }</span>
            {
                followers && (
                    <span className="pl-2">{ subscriber(subscribers) }</span>
                )
            }
        </Button>
    )
}
