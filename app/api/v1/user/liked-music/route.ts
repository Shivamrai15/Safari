import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        
        const session = await auth();
        if (!session || !session.user || !session.user.id){
            return new NextResponse("Unauthorized Access", { status:401});
        }

        const likedSongs = await db.likedSongs.findMany({
            where : {
                userId : session.user.id
            },
            orderBy : {
                createdAt : "desc"
            },
            select : {
                songId : true
            }
        });

        const likedSongIds = likedSongs.map((song)=> song.songId);


        const songs = await db.song.findMany({
            where : {
                id : {
                    in : likedSongIds
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

        songs.sort((a, b) => likedSongIds.indexOf(a.id) - likedSongIds.indexOf(b.id));

        return NextResponse.json(songs, { status:200 });

    } catch (error) {
        console.error("LIKED MUSIC GET API ERROR", error);
        return new NextResponse("Internal server error", {status:500});
    }
}

export async function POST ( req : Request ) {
    try {

        const session = await auth();
        if (!session || !session.user || !session.user.id){
            return new NextResponse("Unauthorized Access", { status:401});
        }

        const { id } : { id : string } = await req.json();
        if ( !id ) { 
            return new NextResponse("Song not found", { status : 404 });
        }

        const song = await db.song.findUnique({
            where : {
                id
            }
        });

        if (!song) {
            return new NextResponse("Song not found", { status : 404 });
        }

        await db.likedSongs.create({
            data : {
                userId : session.user.id,
                songId : id
            }
        });

        return NextResponse.json({ success: true}, { status : 201 });
        
    } catch (error) {
        console.error("LIKED MUSIC GET API ERROR", error);
        return new NextResponse("Internal server error", {status:500});
    }
}

