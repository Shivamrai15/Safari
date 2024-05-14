import { Albums } from "@/components/artist/albums";
import { Subscribe } from "@/components/artist/subscribe";
import { SongItem } from "@/components/song/song-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getArtist } from "@/server/artist";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import { PiShuffleBold } from "react-icons/pi";

interface ArtistPageProps {
    params : { artistId: string }
}

const ArtistPage = async({
    params
} : ArtistPageProps ) => {
    
    const artist = await getArtist(params.artistId);

    if (!artist) {
        redirect("/");
    }

    return (
        <div className="min-h-full bg-neutral-950 pb-20 md:pb-10">
            <div
                className={cn(
                    "w-full h-[30vh] md:aspect-[5/2] md:h-auto bg-no-repeat bg-cover",
                )}
                style={ artist.thumbnail === null ? {background : 'linear-gradient(160deg, #111 30%,  #702228 30%)'} : {backgroundImage : `url(${artist.thumbnail})`} }
            >
                <div className="h-full bg-gradient-to-b from-transparent to-neutral-950 relative md:pr-32">
                    <div className="bottom-0 absolute px-4 md:px-20 md:pr-32">
                        <h1 className="text-white text-4xl sm:text-5xl lg:text-8xl font-extrabold line-clamp-1 py-2">
                            {artist.name}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="px-4 md:px-20 mt-5 flex items-center gap-6 md:pr-32" >
                <Button className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-red-600 hover:bg-red-600/80">
                    <FaPlay className="h-6 w-6 text-white" />
                </Button>
                <PiShuffleBold className="h-12 w-12 text-zinc-300 hover:text-white md:cursor-pointer" />
                <Subscribe artistId={artist.id} followers={artist._count.followers} />
            </div>
            <div className="w-full px-4 md:px-20 mt-20 space-y-6 md:pr-32">
                <h3 className="text-lg sm:text-xl md:text-2xl px-3 font-bold" >Popular</h3>
                <div className="space-y-1">
                    {
                        artist.songs.map((song)=>(
                            <SongItem song={song} key={song.id} />
                        ))
                    }
                </div>
                <div>
                    <Link
                        className="px-4 my-4 rounded-full py-3 flex items-center justify-center border hover:bg-neutral-900"
                        href={`/artist/${artist.id}/songs`}
                    >
                        Show All
                    </Link>
                </div>
            </div>
            <div className="pr-12">
                <Albums id={artist.id} />
            </div>
        </div>
    );
}

export default ArtistPage;