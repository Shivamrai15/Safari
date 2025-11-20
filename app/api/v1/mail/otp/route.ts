import * as z from "zod";
import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/mail";


const schema = z.object({
    key : z.string().length(32),
    token: z.string().length(6, { message: "OTP must be 6 characters long" }).regex(/^\d{6}$/, { message: "OTP must be a 6-digit number" }),
    email: z.string().email(),
})


export async function POST(request: Request) {
    try {
        
        const body = await request.json();
        const parsedData = await schema.safeParseAsync(body);
        if (!parsedData.success) {
            return new NextResponse('Invalid request data', { status: 400 });
        }

        const { key, email, token } = parsedData.data;
        if (key !== process.env.MAIL_VERIFICATION_KEY) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await sendOTPEmail(email, token);
        return new NextResponse('OTP email sent', { status: 200 });

    } catch (error) {
        console.error('Error in POST /mail/otp:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}