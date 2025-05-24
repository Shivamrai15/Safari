"use server";

import { db } from "@/lib/db";


export const getRandomAd = async ()=> {
    try {
        
        const ads = await db.ad.findMany();
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        return randomAd;
        
    } catch (error) {
        console.log("RANDOM AD API ERROR");
        return null;
    }
}

