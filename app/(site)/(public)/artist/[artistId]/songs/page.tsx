import { ArtistSongs } from "@/components/song/artist-songs";
import { ArtistHeader } from "@/components/song/header";

interface ShowAllPageProps {
    params : { artistId : string }
}

const ShowAllPage = async({
    params
} : ShowAllPageProps ) => {

    return (
        <div className="w-full px-4 md:px-20 pb-10 md:pb-0 md:pr-32">
            <ArtistHeader id={params.artistId} />
            <ArtistSongs id={params.artistId} />
        </div>
    )
}

export default ShowAllPage