"use server";

import { db } from "@/lib/db";
import { cache } from "react";
import { Ad } from "@prisma/client";

const getAds = cache(async (): Promise<Ad[]>=> {
    try {
        
        const ads = await db.ad.findMany();
        return ads;
        
    } catch (error) {
        console.log("ADS API ERROR", error);
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

