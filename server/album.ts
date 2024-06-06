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
                    include : { artists : true, album : true }
                }
            },
        });

        return album;

    } catch (error) {
        console.error("GET ALBUM SERVER ERROR");
        return null;
    }
}


export const getAlbums = async () => {
    try {
        
        const albums = await db.album.findMany({
            select : {
                id :true
            }
        });

        return albums;

    } catch (error) {
        console.error("GET ALBUMS SERVER ERROR");
        return [];
    }
}