"use client";

import { Album, Artist, Song } from "@prisma/client";
import { ListItem } from "./list-item";
import { Clock3 } from "lucide-react";

interface ListProps {
    songs : ( Song & { album : Album, artists : Artist[] } )[],
    playlistId? : string;
    isAuth? : boolean;
    mutate? : ( songId : string )=>void;
}

export const List = ({
    songs,
    isAuth,
    playlistId,
    mutate
} : ListProps ) => {
    return (
        <div className="w-full space-y-8 px-4 md:px-20 lg:pr-36">
            <div className="grid grid-cols-7 md:grid-cols-11 gap-4 px-4 font-semibold text-zinc-200 md:px-6">
                <span className="hidden md:block text-lg select-none" >#</span>
                <div className="col-span-5 select-none">Title</div>
                <div className="hidden md:block col-span-4 select-none">Album</div>
                <div className="col-span-2 md:col-span-1"><Clock3/></div>
            </div>
            <div className="space-y-1">
                {
                    songs.map((song, index)=>(
                        <ListItem 
                            key={song.id}
                            song={song} 
                            index={index+1}
                            playlistId={playlistId}
                            isAuth={isAuth}
                            playlistMutate={mutate}
                        />
                    ))
                }
            </div>
        </div>
    )
}
