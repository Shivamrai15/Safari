import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET () {

    try {
        
        const albums = await db.album.findMany({
            take : 10,
            orderBy : {
                release : "desc"
            }
        });
        return NextResponse.json(albums);

    } catch (error) {
        return new NextResponse("Internal server error", { status:500 });
    }

}