import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PlaylistSchema } from "@/schemas/playlist.schema";
import { NextResponse } from "next/server";

export async function POST ( req : Request ) {
    try {
        
        const body = await req.json();
        const validatedData = await PlaylistSchema.safeParseAsync(body);

        if (!validatedData.success){
            return new NextResponse("Playlist fields are required", { status: 401 });
        }

        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized access", { status: 401 });
        }
        
        await db.playList.create({
            data : {
                ...validatedData.data,
                userId : session.user.id
            }
        });

        return NextResponse.json({success : true}, { status : 201 });

    } catch (error) {
        console.log("PLAYLIST POST API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}


export async function GET () {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized access", { status: 401 });
        }

        const playlists = await db.playList.findMany({
            where : {
                userId : session.user.id
            },
            orderBy : {
                createdAt : "desc"
            },
            include : {
                _count : {
                    select : {
                        songs : true
                    }
                }
            }
        });

        return NextResponse.json(playlists, { status: 200 });

    } catch (error) {
        console.log("PLAYLIST GET API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}