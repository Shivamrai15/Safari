import { auth } from "@/auth";
import { db } from "@/lib/db";
import speakeasy from "speakeasy";
import { NextResponse } from "next/server";
import { TwoFactorAuthSchema } from "@/schemas/two-factor.schema";


export async function PATCH ( req: Request ) {
    try {

        const session = await auth();
        if (!session ||!session.user || !session.user.id) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        
        const body = await req.json();
        const validatedData = await TwoFactorAuthSchema.safeParseAsync(body);
        
        if (!validatedData.success) {
            return new NextResponse("Invalid code", {status: 400});
        }

        const user = await db.user.findUnique({
            where: {
                id: session.user.id
            },
            select : {
                twoFactorSecret : true
            }
        });

        if (!user || !user.twoFactorSecret) {
            return new NextResponse("User does not have 2FA enabled", {status: 400});
        }

        const isValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: validatedData.data.token,
        })

        if (!isValid) {
            return new NextResponse("Invalid code", {status: 400});
        }

        await db.user.update({
            where: {
                id: session.user.id
            },
            data: {
                twoFactorEnabled: true
            }
        });

        return NextResponse.json({
            success: true,
            message: "2FA enabled"
        });


    } catch (error) {
        console.error("VERIFY 2FA PATCH API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}