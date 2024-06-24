"use client";

import axios from "axios";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useQueue } from "@/hooks/use-queue";
import { SyncLoader } from "react-spinners";
import { Album, Song } from "@prisma/client";
import { toast } from "sonner";


export const Track = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const { priorityEnqueue } = useQueue();
    
    const fetchSong = async()=> {
        try {
            const response = await axios.get(`/api/v1/song?id=${id}`);
            const song : (Song & { album : Album }) = response.data;
            priorityEnqueue([song]);
            router.push(`/album/${song.albumId}`);
        } catch (error) {
            toast.error("Song not found");
            router.push('/');
        }

    }

    useEffect(()=>{
        if (id) {
            fetchSong();
        }
    }, [id]);


    return (
        <div className="w-full h-full flex items-center justify-center">
            <SyncLoader color="#252525" />
        </div>
    )
}
