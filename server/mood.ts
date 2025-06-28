"use server";

import { db } from "@/lib/db";

export const getMoodById = async (moodId: string) => {
    try {
        
        const mood = await db.mood.findUnique({
            where : {
                id : moodId
            },
            include : {
                _count : {
                    select : {
                        metadata : true
                    }
                }
            }
        });

        return mood;

    } catch (error) {
        console.error("GET MOOD BY ID ERROR:", error);
        return null;
    }
}