"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cache } from "react";

export const getUserSubscription = cache(async()=>{
    const session = await auth();
    if ( !session || !session.user || !session.user.id )
        return null;

    const data = await db.subscription.findFirst({
        where : {
            userId : session.user.id
        },
        orderBy : {
            stripeCurrentPeriodEnd : 'desc'
        },
        select : {
            stripePriceId : true,
            stripeCurrentPeriodEnd : true
        }
    });

    const isActive = data && (new Date(data.stripeCurrentPeriodEnd) > new Date());

    return {
        ...data,
        isActive
    }

});