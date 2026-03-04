import { auth } from "@/auth";
import { getAccessToken } from "@/lib/tokens";
import { HistorySchema } from "@/schemas/history.schema";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        
        const session = await auth();
        if (!session || !session.user || !session.user.id || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const body = await req.json();
        const parsedBody = await HistorySchema.safeParseAsync(body);

        if (!parsedBody.success) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const data = parsedBody.data;
        
        const accessToken = await getAccessToken({
            userId : session.user.id,
            email : session.user.email
        });

        if (!accessToken) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const res = await axios.post(`${process.env.MAINTENANCE_BASE_URL}/api/v1/history`, data, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        });
        
        return NextResponse.json(res.data);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}