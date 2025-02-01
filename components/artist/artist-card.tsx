"use client";
import { Artist } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ListItem } from "./list-item";
import { SyncLoader } from "react-spinners";


interface ArtistCardProps {
    songId: string;
}

type Response = {
    data : {id: string; name: string; image: string}[]|undefined;
    error : Error|null;
    isPending : boolean;
}


export const ArtistCard = ({ songId }: ArtistCardProps) => {
    
    const { data, error, isPending } : Response  = useQuery({
        queryKey : [songId],
        queryFn : async()=>{
            const response = await axios.get(`/api/v1/song/artists?songId=${songId}`);
            return response.data;
        },
    });
    
    return (
        <div className="w-full p-4 space-y-4 bg-neutral-800 rounded-2xl">
            <h1 className="md:text-lg font-semibold">Artists</h1>
            <ul className="flex flex-col gap-y-1">
                {
                    (error || isPending || (!data)) ? (
                        <div className="flex items-center justify-center py-4">
                            <SyncLoader color="#9e9e9e" />
                        </div>
                    ) : (
                        data.map((artist)=>(
                            <ListItem artist={artist} key={artist.id}/>
                        ))
                    )
                }
            </ul>
        </div>
    )
}
