import { db } from "@/lib/db";
import { Mood } from "@prisma/client";
import { NextResponse } from "next/server";

const LIMIT = 10;

export async function GET (request: Request) {
    try {

        const { searchParams } = new URL(request.url);
        const cursor = searchParams.get("cursor");

        let moods : Mood[];

        if (cursor) {
            moods = await db.mood.findMany({
                take : LIMIT,
                skip : 1,
                cursor : {
                    id : cursor
                },
                orderBy : {
                    name : "desc"
                }
            });
        } else {
            moods = await db.mood.findMany({
                take : LIMIT,
                orderBy : {
                    name : "desc"
                }
            });
        }

        let nextCursor = null;
        
        if(moods.length === LIMIT){
            nextCursor = moods[LIMIT-1].id
        }

        return NextResponse.json({
            items : moods,
            nextCursor
        })


        
    } catch (error) {
        console.error("MOODS GET API ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}