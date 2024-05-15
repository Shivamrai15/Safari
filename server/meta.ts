"use server";

import { db } from "@/lib/db";

export const artistMetaData = async ( id : string ) => {
    try {
        const metadata = await db.artist.findUnique({
            where : {
                id
            },
            select : {
                name : true,
                image : true,
                about : true
            }
        });
        return metadata;
    } catch (error) {
        console.error("ARTIST METADATA API ERROR", error);
        return null; 
    }
}
