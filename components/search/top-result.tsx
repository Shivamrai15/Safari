"use client";

import { Album, Artist, Song } from "@prisma/client";
import { TopResultWrapper } from "./top-result-wrapper";
import { Button } from "@/components/ui/button";
import { Disc, Dot, MicVocalIcon } from "lucide-react";
import { IoIosShareAlt } from "react-icons/io";
import { SongPlayButton } from "@/components/utils/song-play-button";
import { useRouter } from "next/navigation";
import { PlayButton } from "../artist/play-button";

interface TopResultProps {
    data : Album | (Song & { album : Album, artists : {id : string, name : string, image: string} [] }) | {id : string, name : string, image: string}
}

export const TopResult = ({
    data
} : TopResultProps ) => {

    const router = useRouter();

    if ( 'release' in data ) {
        return (
            <div>
                <TopResultWrapper
                    image={data.image}
                    name={data.name}
                    url={`/album/${data.id}`}
                    color={data.color}
                >
                    <>
                        <div className="text-sm flex gap-1 text-zinc-200">
                            <span className="select-none" >Album</span>
                            <Dot/>
                            <span className="select-none">{new Date(data.release).getFullYear()}</span>
                        </div>
                        <div className="mt-3 flex items-center gap-x-4">
                            <SongPlayButton id={data.id} />
                            <Button
                                className="px-6 rounded-full font-bold text-base select-none"
                                onClick={(e)=>{
                                    e.stopPropagation();
                                }}
                            >
                                <IoIosShareAlt className="h-5 w-5 mr-2"/> Share
                            </Button>
                        </div>
                    </>
                </TopResultWrapper>
            </div>
        )
    }

    if ( 'album' in data ) {
        return (
            <TopResultWrapper
                image={data.image}
                name={data.name}
                color={data.album.color}
            >
                <>
                    <div className="text-sm flex gap-1 text-zinc-200">
                        <span>Song</span>
                        <Dot/>
                        <div className="w-full overflow-hidden line-clamp-1">
                            By {
                                data.artists.map((artist, idx)=>(
                                    <span key={artist.id} >
                                        {artist.name}
                                        {
                                            idx !== (data.artists.length-1) && ", "
                                        }
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-x-4">
                        <SongPlayButton id={data.id} songs={[data]} />
                        <Button
                            className="px-6 rounded-full font-bold text-base"
                            onClick={()=>router.push(`/album/${data.albumId}`)}
                        >
                            <Disc className="h-5 w-5 mr-2"/> Go to Album
                        </Button>
                    </div>
                </>
            </TopResultWrapper>
        )
    }

    if ( !('release' in data) && (!('album' in data)) ) {
        return (
            <TopResultWrapper
                image={data.image}
                name={data.name}
                color="#171717"
            >
                <>
                    <div className="text-sm flex gap-1 text-zinc-200">
                        Artist
                    </div>
                    <div className="mt-5 flex items-center gap-x-4">
                        <PlayButton artistId={data.id} songs={[]} className="h-12 w-12 md:h-12 md:w-12 p-3" />
                        <Button
                            className="px-6 rounded-full font-bold text-base"
                            onClick={()=>router.push(`/artist/${data.id}`)}
                        >
                            <MicVocalIcon className="h-5 w-5 mr-2"/> Go to Artist
                        </Button>
                    </div>
                </>
            </TopResultWrapper>
        )
    }

    return null;
}
