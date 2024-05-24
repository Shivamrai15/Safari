import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { ResetPasswordSchema } from "@/schemas/reset.schema";
import bcrypt from "bcryptjs";


export async function PATCH ( req : Request ) {
    try {
        
        const body = await req.json();
        const validatedData = await ResetPasswordSchema.safeParseAsync(body);

        if (!validatedData.success) {
            return new NextResponse("Your password is required");
        }

        const { id, password } = validatedData.data;

        const token = await db.forgetPasswordToken.findUnique({
            where : {
                id
            }
        });

        if (!token) {
            return new NextResponse("Your verification link is not valid, or already used.")
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.update({
            where : {
                email : token.email
            },
            data : {
                password: hashedPassword
            }
        });

        await db.forgetPasswordToken.delete({
            where : {
                id : token.id
            }
        })

        return NextResponse.json({success : true}, { status:200 });

    } catch (error) {
        console.error("NEW PASSWORD API ERROR", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}