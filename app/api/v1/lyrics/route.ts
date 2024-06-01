import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET ( req : Request ) {
    try {
        
        const {searchParams} =  new URL(req.url);
        const songId = searchParams.get("songId");

        if ( !songId ) {
            return new NextResponse("SongId not found", { status:400 });
        }

        const lyrics = await db.lyrics.findUnique({
            where : {
                songId
            }
        });

        if ( !lyrics ) {
            return new NextResponse("Lyrics not found", { status:404 })
        }

        return NextResponse.json(lyrics);

    } catch (error) {
        console.error("LYRICS GET API ERROR", error);
        return new NextResponse("Internal server error", { status:500 })
    }
}