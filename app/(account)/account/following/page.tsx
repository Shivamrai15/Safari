"use client";

import { useSubscribers } from "@/hooks/use-subscribers";
import { ArtistCard } from "@/components/search/artist-card";


const FollowingPage = () => {

    const { data, isLoading } : { data : ({
        image: string;
        name: string;
        id: string;
    }[]) , isLoading : boolean } = useSubscribers();

    if ( isLoading || data.length === 0 ) {
        return null;
    }
    

    return (
        <main className="w-full pb-20 md:pb-10 pt-10 md:pt-20">
            <div className="space-y-10">
                <h1 className="text-2xl md:text-3xl font-extrabold">Following</h1>
                <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6" >
                    { data.map((artist)=>(
                        <ArtistCard
                            key={artist.id}
                            artist={artist}
                            className="w-full"
                        />
                    )) }
                </section>
            </div>
        </main>
    )
}

export default FollowingPage