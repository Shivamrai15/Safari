import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AccountSchema } from "@/schemas/account.schema";
import { getUserSubscription } from "@/server/queries";
import { NextResponse } from "next/server";

export async function GET ( req : Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const user = await db.user.findUnique({
            where : {
                id : session.user.id,
            },
            select : {
                id : true,
                name : true,
                privateSession : true,
                showRecommendations : true,
            }
        });

        if ( !user ) {
            return new NextResponse("User not found", { status : 404 });
        }

        const subscription = await getUserSubscription();

        return NextResponse.json({...user, isActive : !!subscription?.isActive }, { status : 200 });

    } catch (error) {
        console.error("ACCOUNT GET API ERROR");
        return new NextResponse("Internal server error");
    }
}


export async function PATCH ( req : Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const body = await req.json();
        const validatedData = await AccountSchema.safeParseAsync(body);

        if (!validatedData.success) {
            return new NextResponse("Invalid data", { status : 400 });
        }

        await db.user.update({
            where : {
                id : session.user.id,
            },
            data : {
                ...validatedData.data,
            }
        });

        return NextResponse.json({ success : true },  { status : 200 });

    } catch (error) {
        console.error("ACCOUNT PATCH API ERROR");
        return new NextResponse("Internal server error");
    }
}