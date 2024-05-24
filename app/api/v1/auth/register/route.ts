import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { RegistrationSchema } from "@/schemas/registration.schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST ( request : Request ) {
    try {
        
        const body = await request.json();
        const data = await RegistrationSchema.safeParseAsync(body);

        if (!data.success) {
            return new NextResponse("Fields are required", { status : 401 });
        }

        const  { email, password, name } = data.data;
        const existingUser = await db.user.findUnique({
            where : {
                email
            }
        });

        if (existingUser) {
            return new NextResponse("Account already exist", { status : 401 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data : {
                email,
                name,
                password : hashedPassword
            }
        });

        const token = await generateVerificationToken(email);
        if (!token) {
            return new NextResponse("Internal server error", { status: 500 });
        }

        await sendVerificationEmail(email, name, token);

        return NextResponse.json({ success : true }, { status : 201 })

    } catch (error) {
        console.error("REGISTER POST API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}