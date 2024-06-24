import { trackMetaData } from "@/server/meta";
import { Metadata } from "next";


interface SongLayoutProps {
    children : React.ReactNode;
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


const SongLayout = ({
    children
} : SongLayoutProps ) => {
    return (
        <main className="h-full">
            {children}
        </main>
    )
}

export default SongLayout;