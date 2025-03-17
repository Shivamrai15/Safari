import { auth } from "@/auth";
import { db } from "@/lib/db";
import { qdrant } from "@/lib/qdrant";
import { NextResponse } from "next/server";

export async function GET ( req: Request ) {
    try {
        
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return new NextResponse("Invalid request", {status: 400});
        }

        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const embedding = await db.embedding.findUnique({
            where :{
                songId: id
            }
        });

        if (!embedding) {
            return new NextResponse("Content not found", {status: 404});
        }

        const similarSongs = await qdrant.search("songMetaData", {
            vector : embedding.vector,
            filter : {
                must_not : [{
                    key: "songId",
                    match: { value: embedding.songId }
                }]
            },
            limit : 10
        });

        const songIds = similarSongs.map(song => song?.payload?.songId) as string[];
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
                    }
                }
            }
        });

        songs.sort((a, b)=>songIds.indexOf(a.id) - songIds.indexOf(b.id));
        return NextResponse.json(songs);

    } catch (error) {
        console.error("SONG RECOMMEND GET API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}