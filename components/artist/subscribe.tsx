"use client";

import { cn, subscriber } from "@/lib/utils";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { useSubscribers } from "@/hooks/use-subscribers";
import axios from "axios";

interface SubscribeProps {
    artistId : string;
    followers : number;
}

export const Subscribe = ({
    artistId,
    followers
} : SubscribeProps ) => {

    console.log("followers", followers)

    const [ subscribers, setSubscribers ] = useState(followers)
    const [loading, setLoading] = useState(false);

    const  { data, isLoading, mutate } = useSubscribers();
    
    const isFollowing = useMemo(()=> {
        if ( isLoading ) return false;
        return data.find((artist : { id : string; name : string; image : string })=>artist.id === artistId); 
    }, [data, isLoading, mutate]);
    

    const handleSubscribe = async () => {
        try {
            setLoading(true);
            if ( isFollowing ) {
                await axios.patch("/api/v1/user/unsubscribe", { artistId });
                mutate();
                setSubscribers((prev)=>prev-1);
            } else {
                await axios.patch("/api/v1/user/subscribe", { artistId });
                mutate();
                setSubscribers((prev)=>prev+1);
            }
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="outline"
            className={cn(
                "rounded-full hover:border-white font-semibold border-red-600 text-red-600 cursor-default md:cursor-pointer",
                isFollowing && "text-zinc-100 border-zinc-100"
            )}
            disabled = {loading}
            onClick={handleSubscribe}
        >
            <span>{ isFollowing ? "Unsubscribe" : "Subscribe" }</span>
            <span className="pl-2">{ subscriber(subscribers) }</span>
        </Button>
    )
}
