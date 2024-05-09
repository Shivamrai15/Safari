import { db } from "@/lib/db";
import { sendForgetPasswordEmail } from "@/lib/mail";
import { generateForgetPasswordToken } from "@/lib/tokens";
import { ForgetPasswordSchema } from "@/schemas/forget-password.schema";
import { NextResponse } from "next/server";

export async function POST ( req : Request ) {
    try {
        
        const body = await req.json();
        const validatedData = ForgetPasswordSchema.safeParse(body);

        if (!validatedData.success) {
            return new NextResponse("Your email is required", { status: 401 });
        }

        const { email } = validatedData.data;

        const user = await db.user.findUnique({
            where : {
                email
            }
        });

        if ( !user || !user.password ) {
            return new NextResponse("Account does not exist");
        }

        const token = await generateForgetPasswordToken(email);

        if (!token) {
            return new NextResponse("Internal server error", { status: 500 });
        }

        await sendForgetPasswordEmail(email, user?.name||"User", token);

        return NextResponse.json({ success : true }, { status : 200 });

    } catch (error) {
        console.error("RESET PASSWORD API ERROR", error);
        return new NextResponse("Internal server error", { status : 500 });
    }
}