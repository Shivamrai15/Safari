import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        
        const session = await auth();
        
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const artists = await db.artist.findMany({
            where : {
                songs : {
                    some : {
                        view : {
                            some : {
                                userId : session.user.id
                            }
                        }
                    }
                }
            },
            select : {
                id: true,
                name : true,
                image : true
            },
            orderBy : {
                songs : {
                    _count : "desc"
                }
            },
            take : 10
        });

        return NextResponse.json(artists);

    } catch (error) {
        console.log("ARTIST FAVOURITE GET API ERROR", error);
        return new NextResponse("Internal server error", {status:500});
    }
}