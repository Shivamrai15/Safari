import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET ( req: Request ) {
    try {

        const { searchParams } = new URL(req.url);
        const artistId = searchParams.get("artistId");
        const albumId = searchParams.get("albumId");

        if ( !artistId || !albumId ) {
            return new NextResponse("Invalid url", { status: 400 });
        }

        const albums = await db.album.findMany({
            where : {
                songs : {
                    some : {
                        artistIds : {
                            has : artistId
                        },
                    }
                },
                id : {
                    not : albumId
                }
            },
            orderBy : {
                release : "desc"
            },
            take : 10,
            select : {
                id : true,
                name : true,
                image : true
            }
        });

        return NextResponse.json(albums);

    } catch (error) {
        console.log("ARTIST ALBUM API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}