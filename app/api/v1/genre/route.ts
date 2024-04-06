import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        
        const genre = await db.genre.findMany();
        return NextResponse.json(genre);

    } catch (error) {
        return new NextResponse("Internal server error", { status: 500})
    }
}