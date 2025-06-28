import { db } from "@/lib/db";
import { Song } from "@/types";
import { Album } from "@prisma/client";
import { NextResponse } from "next/server";

const SONGS_BATCH=10;

export async function GET (req : Request) {
    try {
         const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const id  = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing Genre Id", { status:401 });
        }

        let songs : Song[] = []


        if (cursor) {
            songs = await db.song.findMany({
                where : {
                    metadata : {
                        moodIds : {
                            has : id
                        }
                    }
                },
                include : {
                    artists : {
                        select : {
                            id : true,
                            name : true,
                            image: true
                        }
                    },
                    album : true
                },
                orderBy : {
                    view : {
                        _count : "desc"
                    }
                },
                cursor : {
                    id : cursor
                },
                take : SONGS_BATCH,
                skip : 1,
            });

        } else {
            songs = await db.song.findMany({
                where : {
                    metadata : {
                        moodIds : {
                            has : id
                        }
                    }
                },
                include : {
                    artists : {
                        select : {
                            id : true,
                            name : true,
                            image: true
                        }
                    },
                    album : true
                },
                orderBy : {
                    view : {
                        _count : "desc"
                    }
                },
                take : SONGS_BATCH,
            });
        }

        let nextCursor = null;

        if(songs.length === SONGS_BATCH){
            nextCursor = songs[SONGS_BATCH-1].id
        }

        return NextResponse.json({
            items : songs,
            nextCursor
        });

    } catch (error) {
        console.error("MOOD SONGS API ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}