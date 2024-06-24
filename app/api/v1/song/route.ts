import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET ( req : Request ) {
    try {
        
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if ( !id ) {
            return new NextResponse("Missing song Id", { status:401 });
        }

        const song = await db.song.findUnique({
            where : {
                id
            },
            include : {
                album : true
            }
        });

        if ( !song ) {
            return new NextResponse("Not found", {status:404});
        }

        return NextResponse.json(song);

    } catch (error) {
        console.error("SONG GET API ERROR", error);
        return new NextResponse("Internal server error", { status:500 });
    }
}