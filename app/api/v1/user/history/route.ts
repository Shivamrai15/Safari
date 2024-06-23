import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Album, Artist, Song, History } from "@prisma/client";
import { NextResponse } from "next/server";

const SONGS_BATCH = 10;

export async function POST ( req : Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const  { songId } : { songId : string } = await req.json();

        const prevHistory = await db.history.findFirst({
            where : {
                userId : session.user.id
            },
            orderBy : {
                createdAt : "desc"
            }
        });

        if ( !prevHistory || prevHistory.songId !== songId ) {
            await db.history.create({
                data : {
                    songId,
                    userId : session.user.id
                }
            })
        }

        return NextResponse.json({ success : true },  { status : 201 });

    } catch (error) {
        console.log("HISTORY POST API ERROR", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}


export async function GET ( req : Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const { searchParams } = new URL(req.url); 
        const cursor = searchParams.get("cursor");

        let songs : (Song & {
            artists : {id:string, name:string}[],
            album : Album
        })[] = [] ;

        let history : History[] = []

        if ( cursor ) {
            history = await db.history.findMany({
                where : {
                    userId : session.user.id
                },
                orderBy : {
                    createdAt : "desc"
                },
                take : SONGS_BATCH,
                skip : 1,
                cursor : {
                    id : cursor
                }
            });

            const historySongIds = history.map((item)=> item.songId);

            songs = await db.song.findMany({
                where : {
                    id : {
                        in : historySongIds
                    }
                },
                include : {
                    artists : {
                        select : {
                            id : true,
                            name : true
                        }
                    },
                    album : true
                }
            });

            songs.sort((a, b)=>historySongIds.indexOf(a.id)-historySongIds.indexOf(b.id));
            songs = songs.map((song)=>{
                return {
                    ...song,
                    history : history.find((item)=>item.songId===song.id)?.createdAt
                }
            });

        } else {

            history = await db.history.findMany({
                where : {
                    userId : session.user.id
                },
                orderBy : {
                    createdAt : "desc"
                },
                take : SONGS_BATCH,
            });

            const historySongIds = history.map((item)=> item.songId);

            songs = await db.song.findMany({
                where : {
                    id : {
                        in : historySongIds
                    }
                },
                include : {
                    artists : {
                        select : {
                            id : true,
                            name : true
                        }
                    },
                    album : true
                }
            });

            songs.sort((a, b)=>historySongIds.indexOf(a.id)-historySongIds.indexOf(b.id));
            songs = songs.map((song)=>{
                return {
                    ...song,
                    history : history.find((item)=>item.songId===song.id)?.createdAt
                }
            });
            
        }

        let nextCursor = null;

        if(history.length === SONGS_BATCH){
            nextCursor = history[SONGS_BATCH-1].id
        }

        return NextResponse.json({
            items : songs,
            nextCursor
        });

    } catch (error) {
        console.log("HISTORY GET API ERROR", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}


export async function DELETE ( _req : Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        await db.history.deleteMany({
            where : {
                userId : session.user.id
            }
        });

        return NextResponse.json({success : true});

    } catch (error) {
        console.log("HISTORY DELETE API ERROR", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}