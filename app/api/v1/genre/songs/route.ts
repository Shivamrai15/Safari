import { db } from "@/lib/db";
import { Album, Song, GenreSong } from "@prisma/client";
import { NextResponse } from "next/server";

const SONGS_BATCH = 10;

export async function GET  (req : Request) {
    try {
        
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const id  = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing Genre Id", { status:401 });
        }

        let songs : (Song & {
            artists : {id : string, name : string}[],
            album : Album
        })[] = [];

        let genreSongs : GenreSong[] = [];

        if (cursor) {
            genreSongs = await db.genreSong.findMany({
                where : {
                    genreId :id
                },
                take : SONGS_BATCH,
                skip : 1,
                cursor : {
                    id : cursor
                },
            });

            const genreSongIds = genreSongs.map((item)=> item.songId);

            songs = await db.song.findMany({
                where : {
                    id : {
                        in : genreSongIds
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

            songs.sort((a, b)=>genreSongIds.indexOf(a.id)-genreSongIds.indexOf(b.id));
        } else {
            genreSongs = await db.genreSong.findMany({
                where : {
                    genreId :id
                },
                take : SONGS_BATCH,
            });

            const genreSongIds = genreSongs.map((item)=> item.songId);

            songs = await db.song.findMany({
                where : {
                    id : {
                        in : genreSongIds
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

            songs.sort((a, b)=>genreSongIds.indexOf(a.id)-genreSongIds.indexOf(b.id));
        }

        let nextCursor = null;

        if(genreSongs.length === SONGS_BATCH){
            nextCursor = genreSongs[SONGS_BATCH-1].id
        }

        return NextResponse.json({
            items : songs,
            nextCursor
        });

    } catch (error) {
        console.log("GENRE GET API ERROR", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}