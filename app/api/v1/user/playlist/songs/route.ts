import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PlaylistSong } from "@/types";
import { NextResponse } from "next/server";

const SONGS_BATCH = 10;

export async function GET (req : Request) {
    try {
        
        const { searchParams } = new URL(req.url); 
        const cursor = searchParams.get("cursor");
        const id  = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing Playlist Id", { status:401 });
        }

        const session = await auth();

        const playlist = await db.playList.findUnique({
            where: {
                id: id
            },
            select : {
                id : true,
                userId : true,
                private : true,
                isArchived : true
            }
        });

        if ( !playlist ){
            return new NextResponse("Playlist not found", { status: 404 });
        }

        if ((playlist.private && playlist.userId !== session?.user?.id)|| playlist.isArchived ) {
            return new NextResponse("Unauthorized Access", { status: 401 });
        } 

        let playlistSongs : PlaylistSong[]

        if (cursor) {
            playlistSongs = await db.playlistSong.findMany({
                where : {
                    playlistId : playlist.id
                },
                take : SONGS_BATCH,
                skip : 1,
                cursor : {
                    id : cursor
                },
                include :{
                    song : {
                        include : {
                            album : true,
                            artists : {
                                select :{
                                    id : true,
                                    name : true,
                                    image : true
                                }
                            }
                        }
                    }
                },
                orderBy : {
                    createdAt : "desc"
                }
            });

        } else {
                
            playlistSongs = await db.playlistSong.findMany({
                where : {
                    playlistId : playlist.id
                },
                take : SONGS_BATCH,
                include :{
                    song : {
                        include : {
                            album : true,
                            artists : {
                                select :{
                                    id : true,
                                    name : true,
                                    image : true
                                }
                            }
                        }
                    }
                },
                orderBy : {
                    createdAt : "desc"
                }
            });
            
        }

        let nextCursor = null;

        if(playlistSongs.length === SONGS_BATCH){
            nextCursor = playlistSongs[SONGS_BATCH-1].id
        }

        return NextResponse.json({
            items : playlistSongs,
            nextCursor
        });

    } catch (error) {
        console.error("PLAYLIST SONGS GET API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function DELETE ( req : Request ) {
    try {
        
        const { searchParams } = new URL(req.url);
        const playlistId = searchParams.get("playlistId");
        const songId = searchParams.get("songId");

        if ( !playlistId || !songId ) {
            return new NextResponse("Invalid API call", { status: 400 });
        } 

        const firstPlaylistSong = await db.playlistSong.findMany({
            where : {
                playlistId : playlistId,
            },
            orderBy : {
                createdAt : "asc"
            },
            take : 2
        });

        await db.playlistSong.delete({
            where : {
                songId_playlistId : {
                    songId: songId,
                    playlistId: playlistId,
                }
            }
        });

        if ( firstPlaylistSong[0]?.songId  === songId ) {
            console.log("This is true");
            if ( firstPlaylistSong.length === 2 ) {
                const song = await db.song.findUnique({
                    where : {
                        id : firstPlaylistSong[1].songId
                    },
                    select : {
                        image : true,
                        album : {
                            select : {
                                color : true
                            }
                        }
                    }
                });
    
                if ( song ) {
                    await db.playList.update({
                        where : {
                            id : playlistId
                        }, 
                        data : {
                            image : song.image,
                            color : song.album.color
                        }
                    });
                }
            } else {
                await db.playList.update({
                    where : {
                        id : playlistId
                    }, 
                    data : {
                        image : null,
                        color : null
                    }
                })
            }
            
        }

        return NextResponse.json({ success : true });

    } catch (error) {
        console.error("PLAYLIST SONG DELETE API ERROR", error);
        return new NextResponse("Internal server error");
    }
}