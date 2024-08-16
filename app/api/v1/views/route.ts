import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Album, Song } from "@prisma/client";
import { NextResponse } from "next/server";

const BATCH = 10;

export async function POST( req : Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const { songId } : { songId : string | null | undefined } = await req.json();

        if ( !songId ) {
            return new NextResponse("Song Id is required", { status: 401 });
        }

        const view = await db.view.findUnique({
            where : {
                songId_userId : {
                    songId,
                    userId : session.user.id
                }
            }
        });

        if (!view) {
            await db.view.create({
                data : {
                    songId,
                    userId : session.user.id
                }
            });
        }

        return NextResponse.json({ success : true });

    } catch (error) {
        return new NextResponse("Internal server error", { status:500 });
    }
}

export async function GET( req : Request) {
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
                    id : cursor
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
        console.log("VIEWS GET API ERROR", error);
        return new NextResponse("Internal server error", { status:500 });
    }
}