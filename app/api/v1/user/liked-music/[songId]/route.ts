import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE (
    _request : Request,
    { params } : { params : { songId : string }} 
)  {
    try {

        const session = await auth();
        if (!session || !session.user || !session.user.id){
            return new NextResponse("Unauthorized Access", { status:401});
        }

        await db.likedSongs.delete({
            where : {
                songId_userId : {
                    userId: session.user.id,
                    songId: params.songId
                  }
            }
        })

        return NextResponse.json({ success: true}, { status : 200 });


    } catch (error) {
        console.error("LIKED MUSIC DELETE API ERROR", error);
        return new NextResponse("Internal server error", {status:500});
    }
}