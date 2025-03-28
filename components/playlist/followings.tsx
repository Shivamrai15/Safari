"use client";

import { useSubscribers } from "@/hooks/use-subscribers";
import { ArtistCard } from "../search/artist-card";

export const Followings = () => {
    
    const { data, isLoading } : { data : ({
        image: string;
        name: string;
        id: string;
    }[]) , isLoading : boolean } = useSubscribers();

    if ( isLoading || data.length === 0 ) {
        return null;
    }

    return (
        <div className="space-y-10">
            <h1 className="text-2xl md:text-3xl font-extrabold select-none">Following</h1>
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" >
                { data.map((artist)=>(
                    <ArtistCard
                        key={artist.id}
                        artist={artist}
                        className="w-full"
                    />
                )) }
            </section>
        </div>
    )
}
