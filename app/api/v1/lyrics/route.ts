import { db } from "@/lib/db";
import { NextResponse } from "next/server";


const ERROR_MESSAGES = [
    "Lost for Words. We're still searching for these lyrics.",
    "We've looked everywhere... even between the sofa cushions. No lyrics.",
    "Lyrics? What lyrics? They seem to have vanished into thin air.",
    "These lyrics are playing hide and seek, and they're winning.",
    "We promise we're not making this up, but we can't find the lyrics.",
    "The lyrics have gone on vacation, and they forgot to leave a forwarding address.",
]


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
            return new NextResponse(ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)], { status:404 })
        }

        return NextResponse.json(lyrics);

    } catch (error) {
        console.error("LYRICS GET API ERROR", error);
        return new NextResponse("Internal server error", { status:500 })
    }
}