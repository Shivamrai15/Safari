import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET ( req:Request ) {
    try {
        
        const { searchParams } = new URL(req.url);
        const artistId = searchParams.get("id");

        const artist = await db.artist.findUnique({
            where : {
                id : artistId!
            },
            select : {
                songIds : true
            }
        });

        if ( !artist ) {
            return new NextResponse("Artist not found", { status:404 });
        }

        const artistViews = await db.songPlays.count({
            where : {
                songId : {
                    in : artist.songIds
                }
            }
        });

        return NextResponse.json({ views : artistViews }, { status:200 });

    } catch (error) {
        console.log("ARTIST VIEW GET API ERROR", error);
        return new NextResponse("Internal server error", { status:500 });
    }
}