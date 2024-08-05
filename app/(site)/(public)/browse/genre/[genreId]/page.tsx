import { getGenreById } from "@/server/genre";
import { Header } from "@/components/genre/header";
import { Songs } from "@/components/genre/songs";
import { Error } from "@/components/utils/error";

interface GenrePageProps {
    params : { genreId : string }
}

const GenrePage = async({
    params
} : GenrePageProps ) => {

    const genre = await getGenreById(params.genreId);

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
            <Songs genreId={params.genreId} />
        </main>
    )
}

export default GenrePage;