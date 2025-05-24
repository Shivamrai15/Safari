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
    data : {
        artists : {id: string; name: string; image: string}[];
        metadata : {
            director: string;
            lyricist: string | undefined;
        } | undefined;
    } | undefined;
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
        <div className="w-full p-4 space-y-4 bg-neutral-800 rounded-2xl ring-1 ring-neutral-700/60">
            <h1 className="text-lg font-semibold select-none">Credits</h1>
            {
                (error || isPending || (!data)) ? (
                    <div className="flex items-center justify-center py-4">
                        <SyncLoader color="#9e9e9e" />
                    </div>
                ) : (
                    <>
                        {
                            data.metadata && (
                                <div className="grid grid-cols-2 gap-x-4">
                                    <ul className="flex flex-col gap-y-1">
                                        <h2 className="font-semibold select-none text-zinc-400" >Director</h2>
                                        {
                                            <span className="font-medium select-none">
                                                {data.metadata.director}
                                            </span>
                                        }
                                    </ul>
                                    <ul className="flex flex-col gap-y-1">
                                        <h2 className="font-semibold select-none text-zinc-400" >Lyricist</h2>
                                        {
                                            <span className="font-medium select-none">
                                                {data.metadata.lyricist}
                                            </span>
                                        }
                                    </ul>
                                </div>
                            )
                        }
                        <ul className="flex flex-col gap-y-1">
                            <h2 className="font-semibold select-none text-zinc-400" >Artists</h2>
                            {
                                data.artists.map((artist)=>(
                                    <ListItem artist={artist} key={artist.id}/>
                                ))
                            }
                        </ul>
                    </>
                )
            }
            
        </div>
    )
}
