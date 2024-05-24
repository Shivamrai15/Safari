import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PlaylistSchema } from "@/schemas/playlist.schema";
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
        return new NextResponse("Internal server error", { status: 500 });
    }
}



export async function PATCH ( 
    req : Request,
    { params } : { params : { playlistId : string } }
) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized Access", { status : 401 });
        }

        const body = await req.json();
        const validatedData = await PlaylistSchema.safeParseAsync(body);

        if (!validatedData.success){
            return new NextResponse("Playlist fields are required", { status: 401 });
        }

        const playlist = await db.playList.findUnique({
            where : {
                id : params.playlistId
            },
            select : {
                userId : true
            }
        });

        if ( !playlist ) {
            return new NextResponse("Playlist not found", { status: 404 });
        }

        if ( playlist.userId  !== session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        await db.playList.update({
            where : {
                id : params.playlistId
            },
            data : validatedData.data
        });

        return NextResponse.json({ success : true },  { status : 200 });

    } catch (error) {
        console.error("PLAYLIST PATCH API ERROR" ,error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}



export async function DELETE ( 
    _req : Request,
    { params } : { params : { playlistId : string } }
) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const playlist = await db.playList.findUnique({
            where : {
                id : params.playlistId
            }
        });

        if ( !playlist ) {
            return new NextResponse("Playlist Not Found", { status : 404 });
        }

        if ( playlist.userId !== session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        await db.playList.delete({
            where : {
                id : params.playlistId
            }
        });

        return NextResponse.json({ success : true });

    } catch (error) {
        console.error("PLAYLIST DELETE API ERROR" ,error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}



export async function GET (
    _req : Request,
    { params } : { params : { playlistId : string } }
) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const playlistSongs = await db.playlistSong.findMany({
            where : {
                playlistId : params.playlistId
            },
            orderBy : {
                createdAt : "desc"
            }
        });

        const playlistSongIds = playlistSongs.map((item)=>item.songId);
        const songs = await db.song.findMany({
            where : {
                id : { in : playlistSongIds }
            },
            include : {
                album : true,
            }
        });

        songs.sort((a, b)=>playlistSongIds.indexOf(a.id)-playlistSongIds.indexOf(b.id));

        return NextResponse.json(songs, { status : 200 });

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}