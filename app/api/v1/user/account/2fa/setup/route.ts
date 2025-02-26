import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import speakeasy from "speakeasy";
import bcrypt from "bcryptjs"


export async function POST ( req: Request ) {
    try {

        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const { password } = await req.json();

        if (!password) {
            return new NextResponse("Password is required", { status : 400 });
        }

        const user = await db.user.findUnique({
            where : {
                id : session.user.id
            },
            select : {
                twoFactorEnabled : true,
                password : true
            }
        });

        if (!user || !user.password) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        if (user.twoFactorEnabled) {
            return new NextResponse("Two factor authentication already enabled", { status : 400 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new NextResponse("Invalid password", { status : 400 });
        }

        const secret = speakeasy.generateSecret({
            name : "Safari Music"
        });

        await db.user.update({
            where : {
                id : session.user.id
            },
            data : {
                twoFactorSecret : secret.base32
            }
        });

        return NextResponse.json({
            secret : secret.otpauth_url
        });
        
    } catch (error) {
        console.log("POST 2FA SETUP API ERROR", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}



export async function PATCH ( req: Request ) {
    try {

        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        const { password } = await req.json();

        if (!password) {
            return new NextResponse("Password is required", { status : 400 });
        }

        const user = await db.user.findUnique({
            where : {
                id : session.user.id
            },
            select : {
                twoFactorEnabled : true,
                password : true
            }
        });

        if (!user || !user.password) {
            return new NextResponse("Unauthorized", { status : 401 });
        }

        if (!user.twoFactorEnabled) {
            return new NextResponse("Two factor authentication not enabled", { status : 400 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new NextResponse("Invalid password", { status : 400 });
        }

        await db.user.update({
            where : {
                id : session.user.id
            },
            data : {
                twoFactorSecret : null,
                twoFactorEnabled : false
            }
        });

        return NextResponse.json({
            success : true,
            message : "Two factor authentication disabled",
        });
        
    } catch (error) {
        console.log("POST 2FA SETUP API ERROR", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}