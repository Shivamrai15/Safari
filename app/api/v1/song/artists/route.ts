import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (req: Request) {
    try {
        
        const { searchParams } = new URL(req.url);
        const songId = searchParams.get("songId");

        if (!songId) {
            return new NextResponse("Song id is required", {status: 400});
        }
        
        const artists = await db.artist.findMany({
            where : {
                songIds : {
                    has : songId
                }
            },
            select : {
                id : true,
                name : true,
                image : true
            }
        });

        return NextResponse.json(artists);

    } catch (error) {
        console.error("SONG ARTIST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}