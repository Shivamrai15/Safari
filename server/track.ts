"use server";

import { db } from "@/lib/db";

export const getTrackById = async( id: string ) => {
    try {
        
        const track = await db.song.findUnique({
            where : {
                id
            },
            select : {
                id : true,
                image : true,
                album : true,
                albumId : true,
                artistIds : true,
                artists : {
                    select : {
                        id : true,
                        name : true,
                        image : true,
                    }
                },
                duration : true,
                name : true,
                url : true,
                _count : {
                    select : {
                        view : true
                    }
                }
            }
        });

        return track;

    } catch (error) {
        return null;
    }
}