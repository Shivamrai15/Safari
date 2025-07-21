import * as z from "zod";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { qdrant } from "@/lib/qdrant";

const Schema = z.object({
    not: z.array(z.string()),
    limit: z.number(),
    recommendationId: z.string(),
});

export async function POST (req: Request) {
    try {
        
        const session = await auth();
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const validateData = await Schema.safeParseAsync(body);
        if (!validateData.success) {
            return new NextResponse("Invalid request", { status: 400 });
        }

        const { not, limit, recommendationId } = validateData.data;
        const embeddings = await db.embedding.findUnique({
            where : {
                songId : recommendationId,
            }
        });

        if (!embeddings) {
            return new NextResponse("No embeddings found for this recommendation", { status: 404 });
        }

        const recommendations = await qdrant.search("songMetaData", {
            vector : embeddings.vector,
            filter: {
                must : [
                    {
                        key: "songId",
                        match: {
                            except : not
                        },
                    }
                ]
            },
            limit: limit,
            with_payload : true
        });

        const songIds: string[] = recommendations.map((item)=> item.payload?.songId).filter((id): id is string => !!id);
        if (songIds.length === 0) {
            return new NextResponse("No recommendations found", { status: 404 });
        }

        const songs = await db.song.findMany({
            where: {
                id: {
                    in: songIds
                }
            },
            include :{
                album : true
            } 
        });

        songs.sort((a, b) => songIds.indexOf(a.id) - songIds.indexOf(b.id));
        return NextResponse.json(songs);

    } catch (error) {
        console.error("AI SHUFFLE POST API ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}