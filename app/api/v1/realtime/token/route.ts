import jwt from "jsonwebtoken";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const TOKEN_TTL_SECONDS = 60 * 60;

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return new NextResponse("Realtime is not configured", { status: 503 });
        }

        const token = jwt.sign(
            { userId: session.user.id, email: session.user.email ?? "" },
            secret,
            { expiresIn: TOKEN_TTL_SECONDS }
        );

        return NextResponse.json({ token, expiresAt: Date.now() + TOKEN_TTL_SECONDS * 1000 });
    } catch (error) {
        console.error("REALTIME TOKEN API ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
