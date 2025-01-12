import { db } from "@/lib/db";
import { Album, Song } from "@prisma/client";
import { NextResponse } from "next/server";


const BATCH = 10

export async function GET (req: Request) {
    try {
        
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        let songs : (Song & { album: Album })[] = [];

        if (cursor) {
            songs = await db.song.findMany({
                where : {
                    view : {
                        some : {}
                    }
                },
                include : {
                    album : true
                },
                orderBy : [
                    {
                        view : {
                            _count : "desc"
                        }
                    },
                    {
                        name : "asc"
                    }
                ],
                skip : 1,
                cursor : {
                    id : cursor as string
                },
                take : BATCH 
            });
        } else {
            songs = await db.song.findMany({
                where : {
                    view : {
                        some : {}
                    }
                },
                include : {
                    album : true
                },
                orderBy : [
                    {
                        view : {
                            _count : "desc"
                        }
                    },
                    {
                        name : "asc"
                    }
                ],
                take : BATCH 
            });
        }

        let nextCursor = null;

        if(songs.length === BATCH){
            nextCursor = songs[BATCH-1].id
        }

        return NextResponse.json({
            items : songs,
            nextCursor
        });

    } catch (error) {
        console.error("TRENDING SONGS GET API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}