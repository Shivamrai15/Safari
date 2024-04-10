import { getArtistProfileById } from "@/server/artist";
import { Dot } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

interface ArtistHeaderProps {
    id : string
}

export const ArtistHeader = async({
    id
} : ArtistHeaderProps ) => {
    
    const artist = await getArtistProfileById(id);

    if (!artist) {
        redirect(`/artist/${id}`);
    }

    return (
        <div className="max-w-xl mt-14 md:mt-20">
            <div className="grid grid-cols-3 gap-4 md:gap-8 items-center">
                <div className="w-full relative overflow-hidden rounded-full aspect-square shadow-lg">
                    <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="col-span-2 w-full space-y-3">
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-bold line-clamp-1" >{artist.name}</h2>
                    <div className="flex items-center gap-1 text-zinc-300 font-medium">
                        <span>
                            { artist._count.songs } Songs
                        </span>
                        <Dot/>
                        <span>
                            { artist._count.followers } followers
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

}
