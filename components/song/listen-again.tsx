"use client"

import { useListenAgain } from "@/hooks/use-listen-again";
import { Album, Artist, Song } from "@prisma/client";
import { useSession } from "next-auth/react";
import { ListenAgainCarousel } from "./listen-again-carousel";

export const ListenAgain = () => {

    const session = useSession();
    if ( session.status === "unauthenticated" ) {
        return null;
    }

    const { data, isLoading, error } : {
        data : (Song & { album : Album, artists : Artist[] })[],
        isLoading : boolean,
        error : any
    } = useListenAgain()

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
