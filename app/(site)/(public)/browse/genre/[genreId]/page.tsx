import { Suspense } from "react";

import { getGenreById } from "@/server/genre";
import { Header } from "@/components/genre/header";
import { Songs } from "@/components/genre/songs";
import { Error } from "@/components/utils/error";
import { Loader } from "@/components/utils/loader";

interface GenrePageProps {
    params : { genreId : string }
}

const GenrePage = async({
    params
} : GenrePageProps ) => {

    return (
        <Suspense fallback={<Loader className="h-full"/>}>
            <ServerComponent genreId={params.genreId} />
        </Suspense>
    )
}

export default GenrePage;

async function ServerComponent({ genreId } : { genreId : string }) {
    
    const genre = await getGenreById(genreId);
    if ( !genre ) {
        return (
            <Error />
        )
    }

    return (
        <main className="min-h-full pb-20 bg-[#111]" >
            <Header
                id={genre.id}
                name={genre.name}
                color={genre.color}
                count={genre._count.songs}
                image={genre.image}
            />
            <Songs genreId={genreId} />
        </main>
    )
}