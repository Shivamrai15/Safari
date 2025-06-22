import { Metadata } from "next";
import { Suspense } from "react";

import { trackMetaData } from "@/server/meta";
import { Header } from "@/components/track/header";
import { getTrackById } from "@/server/track";
import { SongsList } from "@/components/song/songs-list";
import { Error } from "@/components/utils/error";
import { Copyright } from "@/components/album/copyright";
import { Loader } from "@/components/utils/loader";

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

    return (
        <Suspense fallback={<Loader className="h-full"/>}>
            <ServerComponent songId={searchParams.id} />
        </Suspense>
    )
}

export default SongPage;


async function ServerComponent({ songId } : { songId : string }) {
    const song = await getTrackById(songId);

    if ( !song ) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Error/>
            </div>
        )
    }


    return (
        <main className="min-h-full max-md:pb-20" style={{background :  `linear-gradient(180deg, #111 80%,  ${song.album.color}5a 100%)` }} >
            <Header
                song={song}
            />
            <div className="md:pr-28">
                <SongsList className="px-4 md:px-20 gap-y-8" songs = { [song] } />
            </div>
            <Copyright label={song.album.label} date={song.album.release} />
        </main>
    )
}