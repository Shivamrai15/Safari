import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";
import {
    upsertProductRecord,
    upsertPriceRecord,
    manageSubscriptionStatusChange,
} from "@/lib/upsert";


const relevantEvents = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
]);


export async function POST(
    request : Request
) {
    const body = await request.text();
    const sign = headers().get('Stripe-Signature');

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event : Stripe.Event;

    try {
        if ( !sign || !webhookSecret ) return;
        event = stripe.webhooks.constructEvent(body, sign, webhookSecret);
    } catch ( error : any) {
        console.log("Error Message", error.message);
        return new NextResponse(`Webhook Error ${error.message}`, { status : 400 });
    }

    if (relevantEvents.has(event.type)){
        try {
            switch(event.type) {
                case 'product.created':
                case 'product.updated':
                    await upsertProductRecord(event.data.object as Stripe.Product);
                    break;
                case 'price.created':
                case 'price.updated':
                    await upsertPriceRecord(event.data.object as Stripe.Price);
                    break;
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription;
                    await manageSubscriptionStatusChange(
                        subscription.customer as string,
                        subscription.id,
                        event.type === "customer.subscription.created"
                    );
                    break;
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;
                    if ( checkoutSession.mode === "subscription" ) {
                        const subscriptionId = checkoutSession.subscription;
                        await manageSubscriptionStatusChange(
                            checkoutSession.customer as string,
                            subscriptionId as string,
                            true
                        );
                    }
                    break;
                default:
                    throw new Error("Unhandled relevent event");
            } 
        } catch (error) {
            console.log("Webhook Error", error);
            return new NextResponse('Last Webhook error', { status :400 });
        }
    }

    return NextResponse.json({ received:true }, { status : 200 });
}

