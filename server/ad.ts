"use server";

import { db } from "@/lib/db";
import { cache } from "react";
import { Ad } from "@prisma/client";
import { redisClient } from "@/lib/redis";

const getAds = cache(async (): Promise<Ad[]>=> {
    try {
        
        const cacheKey = `/safari/ads`;
        const cachedAds = await redisClient.get(cacheKey);
        if (cachedAds) {
            return JSON.parse(cachedAds as string);
        }
        const ads = await db.ad.findMany();
        await redisClient.setex(cacheKey, 3600*24, JSON.stringify(ads));
        return ads;
        
    } catch (error) {
        console.log("ADS API ERROR");
        return [];
    }
})

export const getRandomAd = async ()=> {
    try {
        
        const ads = await getAds();
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        return randomAd;
        
    } catch (error) {
        console.log("RANDOM AD API ERROR");
        return null;
    }
}

