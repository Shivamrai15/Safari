import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { differenceInDays } from "date-fns";

export async function PATCH (
    _req: Request,
    { params } : { params : { playlistId : string } }
){
    try {

        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const playlist = await db.playList.findUnique({
            where : {
                id : params.playlistId,
                userId : session.user.id
            },
            select : {
                id : true,
                archivedAt : true,
                isArchived : true
            }
        });

        if ( !playlist || !playlist.archivedAt || !playlist.isArchived ) {
            return new NextResponse("Playlist not found", {status: 404})
        }

        if ( differenceInDays(playlist.archivedAt, new Date()) > 90 ) {
            await db.playList.delete({
                where : {
                    id : playlist.id
                }
            });

            return new NextResponse("Cannot restore this playlist", {status: 401})
        }

        await db.playList.update({
            where : {
                id : playlist.id
            },
            data : {
                isArchived : false,
                archivedAt : null
            }
        });

        return NextResponse.json({
            success : true,
        });

        
    } catch (error) {
        console.error("PLAYLIST RESTORE PATCH API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}