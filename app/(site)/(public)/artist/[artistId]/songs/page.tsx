import { ArtistSongs } from "@/components/song/artist-songs";
import { ArtistHeader } from "@/components/song/header";
import { artistMetaData } from "@/server/meta";
import { Metadata, ResolvingMetadata } from "next";

interface ShowAllPageProps {
    params : { artistId : string }
}

export async function generateMetadata(
    { params } : ShowAllPageProps,
    parent : ResolvingMetadata
) : Promise<Metadata> {
    
    const data = await artistMetaData(params.artistId);
    const previousImages = (await parent).openGraph?.images || [];
    
    if ( !data ) {
        return {};
    }

    return {
        title: `${data.name} | Safari`,
        description : data.about.trim() === `Dive into ${data.name}'s music on Safari.` ? "Listen to " : data.about,
        openGraph: {
            images: [{
                url : data.image,
                height : 1200,
                width : 1200
            }, ...previousImages],
            type : "music.album",
        },
        twitter : {
            card: 'summary_large_image',
            title: `${data.name} | Safari`,
            description : data.about.trim() === `Dive into ${data.name}'s music on Safari.` ? "Listen to " : data.about,
            images: [{
                url : data.image,
                height : 1200,
                width : 1200
            }], 
        },
        category : "music streaming",
        appLinks : {
            android : {
                package : "com.shivamrai6836.Safari",
                app_name : "Safari",
                url : "safarimusic://artist-songs/" + params.artistId
            },
        },
        other: {
            "al:android:url": "safarimusic://artist-songs/" + params.artistId,
            "al:android:package": "com.shivamrai6836.Safari",
            "al:android:app_name": "Safari",
        }
    }
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