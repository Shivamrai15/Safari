import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET ( req : Request ) {
    try {
        
        const { searchParams } = new URL(req.url);
        const id  = searchParams.get("id");

        if ( !id ) {
            return new NextResponse("Album id is missing", { status: 401 });
        }

        const albumSongs = await db.song.findMany({
            where : {
                albumId : id
            },
            include : {
                album : true
            }
        });

        return  NextResponse.json(albumSongs, { status: 200 });

    } catch (error) {
        console.error("ALBUM GET API ERROR");
        return new NextResponse("Internal server error", { status: 500 });
    }
}