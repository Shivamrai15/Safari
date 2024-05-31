"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cache } from "react";


const DAYS_IN_MS = 86_400_000;

export const getUserSubscription = cache(async()=>{
    const session = await auth();
    if ( !session || !session.user || !session.user.id )
        return null;

    const data = await db.subscription.findFirst({
        where : {
            userId : session.user.id
        },
        orderBy : {
            createdAt : 'desc'
        }
    });

    const isActive = data?.stripePriceId && data.stripeCurrentPeriodEnd?.getTime()! + DAYS_IN_MS > Date.now();

    return {
        ...data,
        isActive : !!isActive
    }

});