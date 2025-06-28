import Link from "next/link";
import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";

import { Albums } from "@/components/artist/albums";
import { Subscribe } from "@/components/artist/subscribe";
import { SongItem } from "@/components/song/song-item";
import { ShuffleButton } from "@/components/utils/shuffle-btn";
import { cn } from "@/lib/utils";
import { getArtist, getArtists } from "@/server/artist";
import { PlayButton } from "@/components/artist/play-button";
import { ShareProfileButton } from "@/components/artist/share-profile";
import { artistMetaData } from "@/server/meta";
import { Profile } from "@/components/artist/profile";
import { Error } from "@/components/utils/error";
import { Loader } from "@/components/utils/loader";

interface ArtistPageProps {
    params : { artistId: string }
}


export async function generateStaticParams () {
    const artists = await getArtists();
    return artists.map(artist => ({ artistId: artist.id }));
}

export async function generateMetadata(
    { params } : ArtistPageProps,
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
        category : "music streaming"
    }
}


const ArtistPage = async({
    params
} : ArtistPageProps ) => {
    
    return (
        <Suspense fallback={<Loader className="h-full"/>}>
            <ServerComponent artistId={params.artistId} />
        </Suspense>
    )
}

export default ArtistPage;


async function ServerComponent({ artistId } : { artistId : string }) {
    const artist = await getArtist(artistId);

    if (!artist) {
        return (
            <Error />
        )
    }

    return (
        <div className="min-h-full bg-neutral-950 pb-20 md:pb-10">
            {
                artist.thumbnail ? (
                    <div
                        className={cn(
                            "w-full h-[30vh] md:aspect-[5/2] md:h-auto bg-no-repeat bg-cover",
                        )}
                        style={{backgroundImage : `url(${artist.thumbnail})`} }
                    >
                        <div className="h-full bg-gradient-to-b from-transparent to-neutral-950 relative md:pr-32">
                            <div className="bottom-0 absolute px-4 md:px-20 md:pr-32">
                                <h1 className="text-white text-4xl sm:text-5xl lg:text-8xl font-extrabold line-clamp-1 py-2 select-none">
                                    {artist.name}
                                </h1>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-[30vh] md:aspect-[5/2] md:h-auto relative">
                        <div 
                            className="w-3/5 right-0 absolute h-full bg-cover"
                            style={{
                                backgroundImage : `url(${artist.image})`,
                                backgroundRepeat : "no-repeat",
                                backgroundSize : "cover",
                                backgroundPosition : "top",
                                filter: "grayscale(100%)"
                            }}
                        />
                        <div
                            className="h-full absolute w-3/5 right-0 bg-gradient-to-b from-transparent from-50% to-neutral-950 "
                        />
                        <div
                            className="h-full absolute w-3/5 right-0 bg-gradient-to-r from-neutral-950 to-transparent"
                        />
                        <div className="h-full relative md:pr-32">
                            <div className="bottom-0 absolute px-4 md:px-20 md:pr-32">
                                <h1 className="text-white text-4xl sm:text-5xl lg:text-8xl font-extrabold line-clamp-1 py-2 select-none">
                                    {artist.name}
                                </h1>
                            </div>
                        </div>
                    </div>
                )
            }
            
            <div className="px-4 md:px-20 mt-5 flex items-center gap-6 md:pr-32" >
                <PlayButton songs={artist.songs} artistId={artist.id} />
                <ShuffleButton/>
                <Subscribe artistId={artist.id} followers={artist._count.followers} />
                <ShareProfileButton artistId={artist.id} />
            </div>
            <div className="w-full px-4 md:px-20 mt-20 space-y-6 md:pr-32">
                <h3 className="text-lg sm:text-xl md:text-2xl px-3 font-bold select-none" >Popular</h3>
                <div className="space-y-1">
                    {
                        artist.songs.map((song)=>(
                            <SongItem song={song} key={song.id} />
                        ))
                    }
                </div>
                <div>
                    <Link
                        className="px-4 my-4 rounded-full py-3 flex items-center justify-center border border-neutral-900 hover:bg-neutral-900 select-none"
                        href={`/artist/${artist.id}/songs`}
                    >
                        Show All
                    </Link>
                </div>
            </div>
            <div className="pr-12">
                <Albums id={artist.id} />
            </div>
            <div className="w-full px-4 md:px-20 mt-20 space-y-6 md:pr-32">
                <Profile
                    id={artist.id}
                    name={artist.name}
                    image={artist.image}
                    about={artist.about}
                />
            </div>
        </div>
    );
}