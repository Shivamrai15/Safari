import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET ( req:Request ) {
    try {
        
        const { searchParams } = new URL(req.url);
        const artistId = searchParams.get("id");

        if (!artistId) {
            return new NextResponse("Artist Id not found", { status: 400 });
        }

        const artist = await db.view.count({
            where : {
                song : {
                    artistIds : {
                        has : artistId
                    }
                }
            }
        });

        if ( !artist ) {
            return new NextResponse("Artist not found", { status:404 });
        }

        return NextResponse.json({ views : artist }, { status:200 });

    } catch (error) {
        console.log("ARTIST VIEW GET API ERROR", error);
        return new NextResponse("Internal server error", { status:500 });
    }
}