import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        
        const genre = await db.genre.findMany({
            include : {
                video : true
            }
        });
        return NextResponse.json(genre);

    } catch (error) {
        return new NextResponse("Internal server error", { status: 500})
    }
}