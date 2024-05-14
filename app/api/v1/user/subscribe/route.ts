import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET ( req : Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const followings = await db.user.findUnique({
            where : {
                id : session.user.id 
            },
            select : {
                following : {
                    select : {
                        id : true,
                        image : true,
                        name : true
                    }
                }
            }
        });

        return NextResponse.json(followings?.following || [] ,  { status : 200 });

    } catch (error) {
        console.error("SUBSCRIBE GET API ERROR", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}

export async function PATCH ( req: Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const { artistId } : { artistId: string } = await req.json();

        if ( !artistId ) {
            return new NextResponse("Missing artist Id",  { status : 401 });
        }

        await db.user.update({
            where : {
                id : session.user.id
            }, 
            data : {
                following : {
                    connect : {
                        id : artistId
                    }
                }
            }
        });

        return NextResponse.json({ success : true });

    } catch (error) {
        console.error("SUBSCRIBE PATCH API ERROR", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}