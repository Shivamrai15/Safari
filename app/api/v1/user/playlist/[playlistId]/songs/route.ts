import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import * as z from "zod";

const BodySchema = z.object({
    songIds : z.string().array().min(1)
});

export async function POST (
    req : Request,
    { params } : { params : { playlistId : string } }
) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized Access", { status : 401 });
        }

        const body = await req.json();
        const validatedData = await BodySchema.safeParseAsync(body);

        if (!validatedData.success){
            return new NextResponse("SongIds are required", { status: 401 });
        }

        const playlist = await db.playList.findUnique({
            where : {
                id : params.playlistId
            },
            select : {
                id: true,
                userId : true,
                _count : {
                    select : {
                        songs : true
                    }
                }
            }
        });

        if ( !playlist ) {
            return new NextResponse("Playlist not found", { status: 404 });
        }

        if ( playlist.userId  !== session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const { songIds } = validatedData.data;

        if (playlist._count.songs === 0) {
            const song = await db.song.findUnique({
                where : {
                    id : songIds[0]
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

            if (!song) {
                return new NextResponse("Invalid song ids", {status: 404})
            }

            await db.playList.update({
                where : {
                    id : playlist.id
                },
                data : {
                    color : song.album.color,
                    image : song.image
                }
            });
        }

        await db.playlistSong.createMany({
            data : songIds.map((id)=>({
                songId : id,
                playlistId : params.playlistId
            }))
        });

        return NextResponse.json({ success : true },  { status : 200 });

    } catch (error) {
        console.error("PLAYLIST SONGS POST API ERROR" ,error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}