import { ArtistSongs } from "@/components/song/artist-songs";
import { ArtistHeader } from "@/components/song/header";
import { ListItem } from "@/components/song/list-item";
import { getSongsByArtistId } from "@/server/song";

interface ShowAllPageProps {
    params : { artistId : string }
}

const ShowAllPage = async({
    params
} : ShowAllPageProps ) => {


    return (
        <div className="w-full px-4 md:px-20">
            <ArtistHeader id={params.artistId} />
            <ArtistSongs id={params.artistId} />
        </div>
    )
}

export default ShowAllPage