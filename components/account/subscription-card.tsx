"use client";

import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { SubscribeBtn } from "./subscribe-btn";
import { postData } from "@/lib/helpers";
import { getStripe } from "@/lib/stripe-client";
import { useState } from "react";

interface SubscriptionCardProps {
    color : string;
    title : string;
    priceId : string;
    price : string;
}

export const SubscriptionCard = ({
    color,
    priceId,
    title,
    price
} : SubscriptionCardProps ) => {

    const session = useSession();
    const [ loading, setLoading ] = useState(false);

    const handleCheckout = async () => {
        try {
            setLoading(true)
            if ( session.status === "unauthenticated" ) {
                toast.error("Login is required");
                return;
            }

            const { sessionId } = await postData({
                url : "/api/create-checkout-session",
                data : {
                    price : priceId
                }
            });

            console.log("sessionId", sessionId)

            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId })


        } catch (error) {
            console.error(error);
            toast.error("Error occurred while creating checkout session");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full rounded-2xl bg-neutral-800 overflow-hidden py-10 space-y-12 hover:-translate-y-3 transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] duration-300" >
            <div className="w-full flex flex-col space-y-4">
                <div className="relative px-6 space-y-6">
                    <div className="flex items-center justify-center pt-4">
                        <h3 
                            className="text-3xl md:text-4xl font-bold cursor-default select-none "
                            style={{ color }}
                        >
                            {title}
                        </h3>
                    </div>
                    <div className="text-base font-semibold cursor-default select-none ">
                        {price}
                    </div>
                </div>
                <Separator className="bg-zinc-600 w-full" orientation="horizontal" />
                <div className="px-6">
                    <ul className="list-disc pl-4 text-base font-medium text-zinc-300 select-none cursor-default">
                        <li>1 Premium Account</li>
                        <li>Add free listening</li>
                        <li>Unlimted playlists</li>
                        <li>Cancel anytime</li>
                        <li>One time payment</li>
                    </ul>
                </div>
            </div>
            <div className="px-6">
                <SubscribeBtn
                    label={`Get ${title}`}
                    className={`bg-[${color}] hover:bg-[${color}7a] text-base`}
                    color={color}
                    onClick={handleCheckout}
                    disabled = {loading}
                />
            </div>
        </div>
    )
}
