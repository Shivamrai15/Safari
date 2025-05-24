"use server";

import { db } from "@/lib/db";

export const getTrackById = async( id: string ) => {
    try {
        
        const track = await db.song.findUnique({
            where : {
                id
            },
            include : {
                _count : {
                    select : {
                        view : true
                    }
                },
                album : {
                    include : {
                        label : true
                    }
                },
                metadata : {
                    include :{
                        moods : {
                            select :{
                                name : true
                            }
                        }
                    }
                },
                artists : {
                    select : {
                        id : true,
                        name : true,
                        image : true
                    }
                }
            }
        });

        return track;

    } catch (error) {
        return null;
    }
}