import { db } from "@/lib/db";
import { Album, Artist, Song } from "@prisma/client";
import { NextResponse } from "next/server";

const SONGS_BATCH = 10;

export async function GET ( req: Request) {
    try {
        
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const id  = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing Artist Id", { status:401 });
        }

        let songs : (Song & {
            artists : Artist[],
            album : Album
        })[] = [];

        if (cursor) {
            songs = await db.song.findMany({
                where : {
                    artists : {
                        some : {
                            id
                        }
                    }
                },
                include : {
                    album : true,
                    artists : true
                },
                take : SONGS_BATCH,
                skip : 1,
                cursor : {
                    id : cursor
                },
                orderBy : {
                    name : "asc"
                }
            });
        } else {
            songs = await db.song.findMany({
                where : {
                    artists : {
                        some : {
                            id
                        }
                    }
                },
                include : {
                    album : true,
                    artists : true
                },
                take : SONGS_BATCH,
                orderBy : {
                    name : "asc"
                }
            })
        }

        let nextCursor = null;

        if(songs.length === SONGS_BATCH){
            nextCursor = songs[SONGS_BATCH-1].id
        }

        return NextResponse.json({
            items : songs,
            nextCursor
        })

    } catch (error) {
        
        console.error("ARTIST SONGS GET API");
        return new NextResponse("Internal server error", { status: 500 });

    }
}