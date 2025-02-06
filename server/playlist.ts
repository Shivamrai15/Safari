"use server";

import { db } from "@/lib/db";

export const getPlaylistById = async( id: string )=>{
    try {

        const playlist = await db.playList.findUnique({
            where : {
                id
            },
            select : {
                _count : {
                    select : {
                        songs : true
                    }
                },
                id : true,
                image : true,
                private : true,
                description : true,
                name : true,
                userId : true,
                color : true,
                isArchived : true
            }
        });
        
        return playlist;

    } catch (error) {
        console.error("GET PLAYLIST BY ID SERVER ERROR", error);
        return null
    }
}