import { db } from "@/lib/db";
import { Album, Song } from "@prisma/client";
import { NextResponse } from "next/server";


const BATCH = 6

export async function GET ( req: Request ) {
    try {
        
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const id  = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing Artist Id", { status:401 });
        }
        
        let albums : ( Album & {songs : (Song & {artists : ({ id: string, name: string })[]})[] } )[] = [];
        
        if (cursor) {
            albums = await db.album.findMany({
                where : {
                    songs : {
                        some : {
                            artistIds : {
                                has : id
                            }
                        }
                    }
                },
                include : {
                    songs : {
                        include : {
                            artists : {
                                select : {
                                    id : true,
                                    name : true
                                }
                            }
                        }
                    }
                },
                orderBy : {
                    release : "desc"
                },
                take : BATCH,
                skip : 1,
                cursor : {
                    id : cursor
                },
            });
        } else {
            albums = await db.album.findMany({
                where : {
                    songs : {
                        some : {
                            artistIds : {
                                has : id
                            }
                        }
                    }
                },
                include : {
                    songs : {
                        include : {
                            artists : {
                                select : {
                                    id : true,
                                    name : true
                                }
                            }
                        }
                    }
                },
                orderBy : {
                    release : "desc"
                },
                take : BATCH,
            });
        } 

        let nextCursor = null;

        if(albums.length === BATCH){
            nextCursor = albums[BATCH-1].id
        }

        return NextResponse.json({
            items : albums,
            nextCursor
        })

    } catch (error) {
        console.log("DISCOGRAPHY API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}