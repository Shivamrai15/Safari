import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { getUrl } from "@/lib/helpers";
import { createOrRetrieveCustomer } from "@/lib/upsert";

export async function POST ( req: Request ) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status: 400 });
        }

        const customer = await createOrRetrieveCustomer({ email : session.user?.email || "", id:session.user.id});
        if ( !customer ) {
            return new NextResponse("Failed to create customer", { status: 400 });
        }

        const { url } = await stripe.billingPortal.sessions.create({
            customer,
            return_url : `${getUrl()}account`
        });

        console.log("PORTAL URL", url);

        return NextResponse.json({url});

    } catch (error) {
        console.error("CREATE PORTAL LINK POST API ERROR", error)
        return new NextResponse("Internal server error", { status:500 });
    }
}