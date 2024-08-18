"use client"

import { Album, Artist, Song } from "@prisma/client";
import { useSession } from "next-auth/react";
import { ListenAgainCarousel } from "./listen-again-carousel";
import { useSWRQuery } from "@/hooks/use-swr-query";

export const ListenAgain = () => {

    const session = useSession();
    
    const { data, isLoading, error } : {
        data : (Song & { album : Album, artists : Artist[] })[],
        isLoading : boolean,
        error : any
    } = useSWRQuery("/api/v1/user/listen-again")
    
    if ( session.status === "unauthenticated" ) {
        return null;
    }
    
    if (error) {
        return null;
    }

    if ( isLoading ) {
        return (
            <ListenAgainCarousel data={[]} loading={true} />
        )
    }

    if ( data.length === 0 ) {
        return null;
    }
    
    return (
        <ListenAgainCarousel data={data} loading={false} />
    )
}
