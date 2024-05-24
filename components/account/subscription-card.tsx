"use client"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils";
import { SubscribeBtn } from "./subscribe-btn";

interface SubscriptionCardProps {
    color : string;
    title : string;
    href : string;
    price : string;
}

export const SubscriptionCard = ({
    color,
    href,
    title,
    price
} : SubscriptionCardProps ) => {
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
                />
            </div>
        </div>
    )
}
