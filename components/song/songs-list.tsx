import { Album, Song } from "@prisma/client";
import { FaRegClock } from "react-icons/fa6";
import { ListItem } from "./list-item";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface SongsListProps {
    songs : (Song & {
        artists : {id : string, name : string, image: string}[],
        album : Album
    })[],
    className? : string;
}

export const SongsList = ({
    songs,
    className
} : SongsListProps ) => {
    return (
        <div className={cn(
            "w-full flex flex-col gap-y-4 py-5",
            className
        )}>
            <div className="w-full space-y-4">
                <div className="w-full flex items-center justify-between px-4 gap-4 md:gap-6">
                    <div className="flex items-center gap-4 md:gap-6 font-semibold text-lg">
                        <h4 className="w-8 select-none">#</h4>
                        <h4 className="select-none cursor-default">Title</h4>
                    </div>
                    <div className="flex items-center w-14 justify-center mr-12">
                        <FaRegClock className="h-5 w-5"/>
                    </div>
                </div>
                <Separator className="text-zinc-600 h-0.5 rounded-full"/>
            </div>
            <div className="flex flex-col">
                {
                    songs.map((song, index)=>(
                        <ListItem key={song.id} song={song} index={index+1} />
                    ))
                }
            </div>
        </div>
    )
}
