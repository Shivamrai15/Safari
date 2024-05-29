import { NextResponse } from "next/server";

import { auth } from "@/auth";
import  { stripe } from "@/lib/stripe";
import  { getUrl } from "@/lib/helpers";
import { createOrRetrieveCustomer } from "@/lib/upsert";

export async function POST ( req : Request ) {
    
    try {
        const { price , quantity=1, metadata } = await req.json();
        const session = await auth();
        if ( !session || !session.user || !session.user.id ) {
            return new NextResponse("Unauthorized", { status: 400 });
        }

        const customer = await createOrRetrieveCustomer({ email : session.user?.email || "", id:session.user.id});

        const stripe_session = await stripe.checkout.sessions.create({
            payment_method_types : ["card"],
            billing_address_collection : "required",
            customer,
            line_items : [
                {
                    price : price,
                    quantity
                }
            ],
            mode : "subscription",
            allow_promotion_codes : true,
            subscription_data : {
                metadata,
            },
            success_url :  `${getUrl()}account`,
            cancel_url : `${getUrl()}`
        });

        return NextResponse.json({ sessionId : stripe_session.id });

    } catch (error) {
        console.error("CREATE CHECKOUT SESSION ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    } 
}