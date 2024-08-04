import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET ( _req: Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status:400 });
        }

        const likedSongs = await db.likedSongs.findMany({
            where : {
                userId : session.user?.id
            },
            orderBy : {
                createdAt : "desc"
            },
            select : {
                songId : true
            }
        });

        const songIds = likedSongs.map((song)=>song.songId);

        const songs = await db.song.findMany({
            where : {
                id : {
                    in : songIds
                }
            },
            include : {
                album : true,
                artists : {
                    select : {
                        id : true,
                        name : true,
                        image : true
                    },
                }
            }
        });

        songs.sort((a, b)=>songIds.indexOf(a.id)-songIds.indexOf(b.id));

        return NextResponse.json(songs);

    } catch (error) {
        return new NextResponse("Internal server error", { status:500 });
    }
}