"use client";

import { IoDiamond } from "react-icons/io5";
import { SectionItem } from "./section-item";
import { TbReceipt } from "react-icons/tb";

export const PaymentSection = () => {

    const routes = [
        { title : "Transaction history", Icon : TbReceipt, route : "/account/manage-subscriptions" },
        { title : "Manage your subscriptions", Icon : IoDiamond, route : "account::manage" },
    ]

    return (
        <section className="p-3 bg-neutral-800/80 rounded-lg space-y-6">
            <h3 className="font-bold text-2xl md:text-3xl px-2 select-none">Subscription</h3>
            <ul>
                {
                    routes.map((item)=>(
                        <SectionItem
                            key={item.route}
                            title={item.title}
                            Icon={item.Icon}
                            route={item.route}
                        />
                    ))
                }
            </ul>
        </section>
    )
}
