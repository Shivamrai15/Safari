"use server";

import { db } from "@/lib/db";

export const getAlbum =  async ( id : string ) => {
    try {
        
        const album = await db.album.findUnique({
            where : {
                id
            },
            include : {
                songs : {
                    include : { artists : true }
                }
            } 
        });

        return album;

    } catch (error) {
        return null;
    }
}