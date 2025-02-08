import { NextResponse } from "next/server";
import { Subscription } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const BATCH = 10;

export async function GET (req: Request) {
    try {
        
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        let orders : Subscription[] = [];

        if (cursor) {
            orders = await db.subscription.findMany({
                where : {
                    userId : session.user.id,
                },
                cursor : {
                    id : cursor
                },
                take : BATCH,
                skip : 1,
                orderBy : {
                    createdAt : "desc"
                }
            });
        } else {
            orders = await db.subscription.findMany({
                where : {
                    userId : session.user.id,
                },
                take : BATCH,
                orderBy : {
                    createdAt : "desc"
                }
            });
        }

        let nextCursor = null;
        
        if(orders.length === BATCH){
            nextCursor = orders[BATCH-1].id
        }
        
        return NextResponse.json({
            items : orders,
            nextCursor
        })


    } catch (error) {
        console.log("PAYMENT ORDER HISTORY GET API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}