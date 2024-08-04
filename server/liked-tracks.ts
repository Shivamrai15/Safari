"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getLikedSongs = async()=>{
    try {
        
        const session = await auth();
        if (!session) {
            return null;
        }

        const likedSongs = await db.likedSongs.findMany({
            where : {
                userId : session.user?.id
            },
            orderBy : {
                createdAt : "desc"
            },
            select : {
                songId : true
            }
        });

        const songIds = likedSongs.map((song)=>song.songId);

        const songs = await db.song.findMany({
            where : {
                id : {
                    in : songIds
                }
            },
            include : {
                album : true,
                artists : {
                    select : {
                        id : true,
                        name : true,
                        image : true
                    },
                }
            }
        });

        songs.sort((a, b)=>songIds.indexOf(a.id)-songIds.indexOf(b.id));
        return songs;

    } catch (error) {
        console.log("LIKED SONGS SERVER ERROR", error);
        return null;
    }
}