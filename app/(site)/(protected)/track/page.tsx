import { Metadata } from "next";
import { Track } from "@/components/song/track";
import { trackMetaData } from "@/server/meta";

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

const SongPage = () => {

    return (
        <Track/>
    )
}

export default SongPage;