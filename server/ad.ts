"use server";

import { db } from "@/lib/db";
import { redisClient } from "@/lib/redis";
import { Ad } from "@prisma/client";

export const getRandomAd = async ()=> {
    try {

        const cacheKey = "safari-ad";
        const cachedData : Ad[]|null = await redisClient.get(cacheKey);
        if (cachedData) {
            const randomAd = cachedData[Math.floor(Math.random() * cachedData.length)];
            return randomAd;
        }
        const ads = await db.ad.findMany();
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        await redisClient.set(cacheKey, ads);
        return randomAd;
        
    } catch (error) {
        console.log("RANDOM AD API ERROR");
        return null;
    }
}

