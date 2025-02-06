import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET ( _req: Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status:400 });
        }

        const songs = await db.likedSongs.findMany({
            where : {
                userId : session.user?.id
            },
            orderBy : {
                createdAt : "desc"
            },
            include : {
                song : {
                    include : {
                        album : true,
                        artists : {
                            select : {
                                id : true,
                                name : true,
                                image : true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(songs.map((likedSong)=>likedSong.song));

    } catch (error) {
        return new NextResponse("Internal server error", { status:500 });
    }
}