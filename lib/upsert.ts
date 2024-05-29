import { stripe } from "./stripe";
import { toDateTime } from "./helpers";
import Stripe from "stripe";
import { db } from "./db";


const upsertProductRecord = async ( product : Stripe.Product ) => {
    try {
        await db.product.create({
            data : {
                productId : product.id,
                active : product.active,
                name : product.name,
                description : product.description,
                image : product.images[0],
                metadeta : product.metadata
            }
        });

        console.log("Product inserted", product.id);
    } catch (error) {
        throw error;
    }
}


const upsertPriceRecord = async( price : Stripe.Price ) => {
    try {
        await db.price.create({
            data : {
                productId : typeof price.product==="string" ? price.product : "",
                active : price.active,
                priceId : price.id,
                currency : price.currency,
                description : price.nickname,
                pricing_type : price.type,
                unit_amount : price.unit_amount,
                interval : price.recurring?.interval || "",
                interval_count : price.recurring?.interval_count,
                trial_period_days : price.recurring?.trial_period_days,
                metadeta : price.metadata
            }
        });
        console.log("Product inserted", price.id);
    } catch (error) {
        throw error
    }
}


const createOrRetrieveCustomer = async ( {
        email,
        id
    } : {
        email : string
        id : string
    } 
) => {

    const data = await db.customer.findUnique({
        where : {
            id
        }
    });

    if ( !data ) {
        const customerData : { metadata : { id : string }; email? :string ;} = {
            metadata : {
                id
            }
        }
        if ( email ) customerData.email = email;
        const customer = await stripe.customers.create(customerData);
        await db.customer.create({
            data : {
                id,
                stripeCustomerId : customer.id,
            }
        });
        console.log("New customer created and inserted", customer.id);
        return customer.id;
    }

    return data.stripeCustomerId
}


const copyBillingDetailsToCustomer = async (
    payment_method : Stripe.PaymentMethod
) => {
    const customer = payment_method.customer as string;
    const { name, phone, address } = payment_method.billing_details;
    if ( !name || !phone || !address ) return;

    // @ts-ignore
    await stripe.customers.update(customer, { name, phone, address });
}


const manageSubscriptionStatusChange = async (
    customerId : string,
    subscriptionId : string,
    createAction = false
) => {
    const data = await db.customer.findUnique({
        where : {
            stripeCustomerId : customerId
        },
        select : {
            id : true,
        }
    });

    if ( !data ) throw new Error("No customer");
    const subscriptions = await stripe.subscriptions.retrieve(subscriptionId, {
        expand : ["default_payment_method"]
    });

    await db.subscription.create({
        data : {
            userId : data.id,
            stripePriceId : subscriptions.items.data[0].price.id,
            stripeCustomerId : customerId,
            stripeSubscriptionId : subscriptions.id,
            stripeCurrentPeriodEnd : toDateTime(subscriptions.current_period_end),
        }
    });
    console.log("Created Subscription", subscriptions.id);

    if ( createAction && subscriptions.default_payment_method && data.id ) {
        await copyBillingDetailsToCustomer(subscriptions.default_payment_method as Stripe.PaymentMethod);
    }
}


export {
    upsertPriceRecord,
    upsertProductRecord,
    createOrRetrieveCustomer,
    manageSubscriptionStatusChange
}
