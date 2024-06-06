import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status:400 });
        }

        const mostPicks = await db.history.groupBy({
            by : ["songId"],
            where : {
                userId : session.user.id
            },
            _count : {
                songId : true
            },
            orderBy : {
                _count : {
                    songId : "desc"
                }
            },
            take : 16
        });

        const mostPicksSongIds = mostPicks.map((song)=>song.songId);
        const songs = await db.song.findMany({
            where : {
                id : {
                    in : mostPicksSongIds
                }
            },
            include : {
                artists : {
                    select : {
                        id:true,
                        name : true,
                    }
                },
                album : true
            }
        });

        songs.sort((a, b)=>mostPicksSongIds.indexOf(a.id)-mostPicksSongIds.indexOf(b.id));
        return NextResponse.json(songs, { status:200 });

    } catch (error) {
        console.error("LISTEN AGAIN GET API ERROR", error);
        return new NextResponse("Internal Server Error", { status:500 });
    }
}