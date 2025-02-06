"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getLikedSongs = async()=>{
    try {
        
        const session = await auth();
        if (!session) {
            return null;
        }

        const songs = await db.likedSongs.findMany({
            where : {
                userId : session.user?.id
            },
            orderBy : {
                createdAt : "desc"
            },
            include : {
                song : {
                    include : {
                        album : true,
                        artists : {
                            select : {
                                id : true,
                                name : true,
                                image : true
                            }
                        }
                    }
                }
            }
        });
        return songs;

    } catch (error) {
        console.log("LIKED SONGS SERVER ERROR", error);
        return null;
    }
}