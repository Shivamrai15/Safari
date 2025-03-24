"use client";

import { Genre } from "@/components/genre/genre";
import { GenreSkeleton } from "@/components/genre/genre-skeleton";
import { useSWRQuery } from "@/hooks/use-swr-query";
import { Genre as GenreType, Video } from "@prisma/client";

const BrowsePage = () => {

    const  { data, isLoading } : { data : (GenreType &{ video : Video|null })[] , isLoading: boolean }  = useSWRQuery("/api/v1/genre");


    return (
        <div className="px-6 md:px-10 pb-20 md:pb-10 pt-10 md:pt-20 space-y-10 md:pr-32">
            <h2 className="text-2xl md:text-3xl font-bold select-none">Moods & genres</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6 md:gap-8">
                {
                    isLoading ? (
                        <>
                            <GenreSkeleton/>
                            <GenreSkeleton/>
                            <GenreSkeleton/>
                            <GenreSkeleton/>
                            <GenreSkeleton/>
                            <GenreSkeleton/>
                            <GenreSkeleton/>
                        </>
                    ) : data.map((genre)=>(
                        <Genre
                            key={genre.id}
                            id={genre.id}
                            image={genre.image}
                            name={genre.name}
                            video={genre.video}
                        />
                    ))
                }
            
            </div>
        </div>
    )
}

export default BrowsePage;