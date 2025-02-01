import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redisClient } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET ( req : Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if ( !id ) {
            return new NextResponse("Artist id missing", { status:401 });
        }

        const cacheKey = `/api/v1/artist:${id}`;
        const cachedData = await redisClient.get(cacheKey);

        if (cacheKey) {
            if (cachedData) {
                return NextResponse.json(cachedData, {status: 200});
            }
        }

        const songs = await db.song.findMany({
            where : {
                artistIds : {
                    has : id
                }
            },
            include : { album : true }
        });

        await redisClient.set(cacheKey, songs);
        return NextResponse.json(songs);

    } catch (error) {
        console.error("ARTIST GET API ERROR", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}