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
        const id  = searchParams.get("id");

        
        if ( !id ) {
            return new NextResponse("Album id is missing", { status: 401 });
        }

        const cacheKey = `/api/v1/album:${id}`;
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            return NextResponse.json(cachedData, {status: 200});
        }

        const albumSongs = await db.song.findMany({
            where : {
                albumId : id
            },
            include : {
                album : true
            }
        });

        await redisClient.set(cacheKey, albumSongs);
        return  NextResponse.json(albumSongs, { status: 200 });

    } catch (error) {
        console.error("ALBUM GET API ERROR");
        return new NextResponse("Internal server error", { status: 500 });
    }
}