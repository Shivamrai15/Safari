"use client";

import Image from "next/image";
import { ShuffleButton } from "@/components/utils/shuffle-btn";
import { PlaylistOptions } from "./options";
import { useSession } from "next-auth/react";
import { usePlaylistModal } from "@/hooks/use-playlist-modal";
import { PlayButton } from "./play-button";
import { usePlaylist } from "@/hooks/use-playlist";
import { PlayList } from "@prisma/client";

interface HeaderProps {
    id : string;
    image : string;
    name : string;
    color : string;
    songs : number;
    description? : string;
    isPrivate : boolean;
    userId : string;
}

export const Header = ({
    id,
    image,
    name,
    color,
    songs,
    description,
    isPrivate,
    userId
} : HeaderProps ) => {

    const session = useSession();
    const { setData, onOpen } = usePlaylistModal();
    const { data, isLoading } : { data : (PlayList & { _count: { songs: number} })[], isLoading: boolean } = usePlaylist();
    
    const playlist = isLoading ? null : data.find((item)=>item.id===id);

    const handleEditModal = () => {
        if ( session.status === "authenticated" && session.data.user?.id === userId ) {
            setData({
                id,
                name : playlist?.name || name,
                private : playlist ? playlist.private : isPrivate,
                description : playlist?.description || description
            });
            onOpen();
        }
    }


    return (
        <div className="px-4 md:px-20" style={{background :  `linear-gradient(160deg, ${playlist? (playlist?.color || "#242424") : color} 40%, #111 30%)` }} >
            <div className="pt-14 md:pt-20 pb-10">
                    <div
                        className="flex flex-col md:flex-row items-center gap-x-8"
                    >
                        <div
                            className="relative aspect-square h-44 w-44 lg:h-60 lg:w-60 shadow-xl"
                        >
                            <Image
                                fill
                                alt={name}
                                src={playlist ? ( playlist?.image || "/assets/playlist.png" ) : image}
                                className="object-cover rounded-md"
                            />
                        </div>
                        <div
                            className="flex flex-col gap-y-2 mt-4 md:mt-0 text-center md:text-left md:pr-28 select-none cursor-default"
                        >
                            <p className="hidden md:block font-semibold text-sm">
                                { songs === 1 ? "Single" : "Playlist" }
                            </p>
                            <h1 
                                className="text-white text-4xl sm:text-5xl lg:text-8xl font-extrabold line-clamp-1 py-2"
                                onClick={handleEditModal}
                            >
                                {playlist?.name || name}
                            </h1>
                            <div className="font-semibold text-sm flex items-center justify-center md:justify-start">
                                <span>
                                    {`${playlist?._count.songs || songs} Songs`}
                                </span>
                            </div>
                            <div className="flex justify-center md:justify-start items-center gap-6 pt-2 md:pr-28" >
                                <PlayButton id={id} />
                                <ShuffleButton/>
                                <PlaylistOptions 
                                    id={id}
                                    isPrivate={ playlist?.private ||isPrivate}
                                    handleEditModal={handleEditModal} 
                                    disabled = { session.status==="unauthenticated" || session.data?.user?.id !== userId }
                                    isAuth = { session.status === "authenticated" }
                                    name = {name}
                                />
                            </div>
                        </div>
                    </div>    
            </div>
        </div>
    )
}
