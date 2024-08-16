"use server";

import { db } from "@/lib/db";

export const getGenreById = async( genreId : string )=> {
    try {
        
        const genre = await db.genre.findUnique({
            where : {
                id : genreId
            },
            select : {
                id : true,
                _count : {
                    select :{ 
                        songs : true
                    }
                },
                color : true,
                name : true,
                image : true
            }
        });

        return genre;

    } catch (error) {
        console.error("GENRE SERVER API ERROR", error);
        return null;
    }
}