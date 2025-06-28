import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (request: Request, { params }: { params: { moodId: string } }) {
    try {
        
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const moodId = params.moodId;
        if (!moodId) {
            return new NextResponse("Mood ID is required", { status: 400 });
        }

        const song = await db.song.findMany({
            where : {
                metadata : {
                    moodIds : {
                        has: moodId
                    }
                }
            },
            include : {
                album : true
            },
            orderBy : {
                view : {
                    _count : "desc"
                }
            }
        });

        if (!song || song.length === 0) {
            return new NextResponse("No songs found for this mood", { status: 404 });
        }
        
        return NextResponse.json(song);

    } catch (error) {
        console.error("Mood API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}