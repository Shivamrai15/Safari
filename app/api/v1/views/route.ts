import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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

        const view = await db.songPlays.findUnique({
            where : {
                songId_userId : {
                    songId,
                    userId : session.user.id
                }
            }
        });

        if (!view) {
            await db.songPlays.create({
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

export async function GET(_req : Request) {
    try {
        
        const mostPlayedSongs = await db.songPlays.groupBy({
            by: ['songId'],
            _count: {
                songId: true
            },
            orderBy: {
                _count: {
                songId: 'desc'
                }
            },
            take: 10
        });

        const mostPlayedSongIds = mostPlayedSongs.map((song)=>song.songId);

        const songs = await db.song.findMany({
            where : {
                id : {
                    in : mostPlayedSongIds
                }
            },
            include : {
                album : true
            }
        });

        songs.sort((a, b)=>mostPlayedSongIds.indexOf(a.id)-mostPlayedSongIds.indexOf(b.id))

        return NextResponse.json(songs);

    } catch (error) {
        console.log("VIEWS GET API ERROR", error);
        return new NextResponse("Internal server error", { status:500 });
    }
}