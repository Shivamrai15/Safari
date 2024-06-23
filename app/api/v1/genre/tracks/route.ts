import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET ( req : Request ) {
    try {
        
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if ( !id ) {
            return new NextResponse("Missing genre Id", { status:401 });
        }

        const genreSongs = await db.genreSong.findMany({
            where : {
                genreId : id
            },
            select : {
                songId : true
            }
        });

        const genreSongIds = genreSongs.map((song)=>song.songId);

        const songs = await db.song.findMany({
            where : {
                id : {
                    in : genreSongIds
                }
            },
            include : {
                album : true
            }
        });

        songs.sort((a, b)=>genreSongIds.indexOf(a.id)-genreSongIds.indexOf(b.id));

        return NextResponse.json(songs);

    } catch (error) {
        console.error("GENRE TRACK GET API ERROR", error);
        return new NextResponse("Internal server error", { status:500 });
    }
}