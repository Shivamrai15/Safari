"use client";

import { Fragment, useEffect } from "react";
import { useQuery } from "@/hooks/use-query";
import { useInView } from "react-intersection-observer";
import { SyncLoader } from "react-spinners";
import { Subscription } from "@prisma/client";
import { format } from "date-fns";


const products = {
    "price_1PLVQoSF9kH75ipG3YQe4k4Y" : {
        amount : 99,
        plan : "Basic"
    },
    "price_1PLVX8SF9kH75ipGU9rTB5HC" : {
        amount : 189,
        plan : "Lite"
    },
    "price_1PLVZkSF9kH75ipG33UoFPOx" : {
        amount : 499,
        plan : "Elite"
    },
    "price_1PLVcJSF9kH75ipGigh23CQ9" : {
        amount : 899,
        plan : "Prime"
    }
}


export const Subscriptions = () => {
    

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useQuery({ url : `/api/v1/user/payment/order-history`, paramKey : "" , paramValue : "", queryKey:"transaction-history" })
    const { ref, inView } = useInView();

    useEffect(()=>{

        if (inView && hasNextPage) {
            fetchNextPage();
        }

    }, [hasNextPage, inView])

    if ( status === "pending" ) {
        return (
            <div className="mt-16 md:mt-20 w-full flex items-center justify-center">
                <SyncLoader color="#252525" />
            </div>
        )
    }

    if ( status === "error" ) {
        return (
            <div className="mt-16 md:mt-20 w-full flex items-center justify-center text-base font-medium text-zinc-400 select-none">
                Something went wrong
            </div>
        )
    }
    
    return (
        <div className="w-full flex flex-col gap-y-2 md:gap-y-3">
            <div className="hidden md:grid md:grid-cols-3 px-2 gap-x-4">
                <p className="font-bold text-zinc-400 select-none">Plan</p>
                <p className="font-bold text-zinc-400 select-none">Ends On</p>
                <p className="font-bold text-zinc-400 select-none">Amount</p>
            </div>
            <div className="h-[1px] bg-neutral-700/90 rounded-md block" />
            {
                    data?.pages.map((group, i)=>(
                        <Fragment key={i} >
                            { group.items.map((subscription : Subscription ) => (
                                <>
                                    <div 
                                        key={subscription.id}
                                        className="hidden md:grid md:grid-cols-3 px-2 gap-x-4"
                                    >
                                        <p className="text-zinc-400 font-medium truncate select-none">{
                                            // @ts-ignore
                                            products[subscription.stripePriceId].plan
                                        }</p>
                                        <p className="text-zinc-400 font-medium select-none">{format(subscription.stripeCurrentPeriodEnd, "dd/MM/yy")}</p>
                                        <p className="text-zinc-400 font-medium truncate select-none">{
                                            // @ts-ignore
                                            products[subscription.stripePriceId].amount
                                        }</p>
                                    </div>
                                    <div
                                        key={subscription.id}
                                        className="flex justify-between items-end gap-x-4 md:hidden"
                                    >
                                        <div className="flex-1">
                                            <div className="flex flex-col">
                                                <p className="text-zinc-400 font-medium truncate select-none">{
                                                    // @ts-ignore
                                                    products[subscription.stripePriceId].plan
                                                }</p>
                                                <p className="text-zinc-400 font-medium mt-3 select-none">{format(subscription.stripeCurrentPeriodEnd, "dd/MM/yy")}</p>
                                            </div>
                                        </div>
                                        <p className="text-zinc-400 font-medium truncate select-none">
                                            {
                                                // @ts-ignore
                                                products[subscription.stripePriceId].amount
                                            }
                                        </p>
                                    </div>
                                    <div
                                        key={subscription.id}
                                        className="h-[1px] bg-neutral-700/90 rounded-md block"
                                    />
                                </>
                            ))}
                        </Fragment>
                    ))
                }
                {
                    isFetchingNextPage && (
                        <div className="pt-6 w-full flex items-center justify-center">
                            <SyncLoader color="#252525" />
                        </div>
                    )
                }
                <div className="h-4 w-full" ref = {ref} />
        </div>
    )
}
