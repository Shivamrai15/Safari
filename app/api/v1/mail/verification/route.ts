import * as z from "zod";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/mail";


const schema = z.object({
    key : z.string().length(32),
    token: z.string().min(1),
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

        await sendVerificationEmail(email, undefined, token);
        return new NextResponse('Verification email sent', { status: 200 });

    } catch (error) {
        console.error('Error in POST /mail/verification:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}