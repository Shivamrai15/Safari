"use client";
import { Genre } from "@/components/genre/genre";
import { GenreSkeleton } from "@/components/genre/genre-skeleton";
import { useGenre } from "@/hooks/use-genre";
import { Genre as GenreType } from "@prisma/client";

const BrowsePage = () => {

    const  { data, isLoading } : { data : GenreType[] , isLoading: boolean }  = useGenre();

    

    return (
        <div className="px-4 md:px-10 pb-20 md:pb-10 pt-10 md:pt-20 space-y-10 md:pr-32">
            <h2 className="text-2xl md:text-3xl font-bold select-none">Moods & genres</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
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
                        />
                    ))
                }
            
            </div>
        </div>
    )
}

export default BrowsePage;