import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST (
    req : Request,
    { params } : { params : { playlistId : string } }
) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized Access", { status : 401 });
        }

        const playlist = await db.playList.findUnique({
            where : {
                id : params.playlistId
            }, 
            select : {
                _count : {
                    select : {
                        songs : true
                    }
                },
                id : true,
                userId : true
            }
        });
        
        if ( !playlist ) {
            return new NextResponse("Playlist Not Found", { status : 404 });
        }

        if ( playlist.userId !== session.user.id ){
            return new NextResponse("Unauthorized Access", { status : 401 });
        }
        
        const { songId } : { songId : string } = await req.json();

        const song = await db.song.findUnique({
            where : {
                id : songId
            },
            include : {
                album : true
            }
        });

        if (!song){
            return new NextResponse("Song Not Found", { status : 404 });
        }

        if ( playlist._count.songs === 0 ) {
            
            await db.playList.update({
                where : {
                    id : playlist.id
                },
                data : {
                    image : song.album.image,
                    color : song.album.color
                }
            })
        }

        await db.playlistSong.create({
            data : {
                playlistId : params.playlistId,
                songId
            }
        });

        return NextResponse.json({ success : true }, { status:201 });

    } catch (error) {
        console.error("PLAYLIST SONG POST API ERROR" ,error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}