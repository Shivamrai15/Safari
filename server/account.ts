"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getArchivedPlaylists = async()=>{
    try {
        
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return {
                success : false,
                data : []
            }
        }
        const playlists = await db.playList.findMany({
            where : {
                userId : session.user.id,
                isArchived : true
            },
            select : {
                id : true,
                name : true,
                archivedAt : true,
                _count : {
                    select : {
                        songs : true
                    }
                }
            },
            orderBy : {
                archivedAt : "desc"
            }
        });

        return {
            success : true,
            data : playlists
        }

    } catch (error) {
        console.log(error);
        return {
            success : false,
            data : []
        }
    }
}