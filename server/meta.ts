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


export const albumMetaData = async ( id: string ) => {
    try {
        
        const metadata = await db.album.findUnique({
            where : {
                id
            },
            select : {
                image : true,
                name : true,
                release : true,
                _count : {
                    select : {
                        songs : true
                    }
                }
            }
        });

        return metadata;

    } catch (error) {
        console.error("ALBUM METADATA API ERROR", error);
        return null;
    }
}


export const trackMetaData = async ( id: string ) => {
    try {
        
        const song = await db.song.findUnique({
            where : {
                id
            },
            select : {
                name : true,
                image: true,
                album : {
                    select : {
                        name : true,
                        release : true
                    }
                },
                artists : {
                    select :{
                        name : true
                    }
                }
            }
        });

        return song;

    } catch (error) {
        console.error("TRACK METADATA API ERROR", error);
        return null;
    }
}