import { Metadata } from "next";

import { trackMetaData } from "@/server/meta";
import { Header } from "@/components/track/header";
import { getTrackById } from "@/server/track";
import { SongsList } from "@/components/song/songs-list";
import { Error } from "@/components/utils/error";

interface SongLayoutProps {
    searchParams : {
        id : string
    };
}

export async function generateMetadata(
    { searchParams }: SongLayoutProps,
): Promise<Metadata> {

    const track = await trackMetaData(searchParams.id);
    
    if ( !track ) {
        return {}
    }
   
    return {
        title: track.name,
        description : `${track.artists.map((artist)=>artist.name).join(", ")} • Song • ${new Date(track.album.release).getFullYear()}`,
        openGraph: {
            images: [track.image],
            type : "music.song",
        },
        twitter : {
            card: 'summary_large_image',
            title: track.name,
            description : `${track.artists.map((artist)=>artist.name).join(", ")} • Song • ${new Date(track.album.release).getFullYear()}`,
            images: [track.image], 
        },
        category : "song"
        
    }
}

const SongPage = async({
    searchParams
} : SongLayoutProps ) => {

    const song = await getTrackById(searchParams.id);

    if ( !song ) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Error/>
            </div>
        )
    }


    return (
        <main className="h-full" style={{background :  `linear-gradient(180deg, #111 80%,  ${song.album.color}5a 100%)` }} >
            <Header
                song={song}
            />
            <div className="md:pr-28">
                <SongsList className="px-4 md:px-20 gap-y-8" songs = { [song] } />
            </div>
        </main>
    )
}

export default SongPage;