"use client";


import { FaRegUser } from "react-icons/fa6";
import { RiHistoryFill } from "react-icons/ri";
import { SectionItem } from "./section-item";
import { ListRestart } from "lucide-react";

export const AccountSection = () => {

    const routes = [
        { title: "Your profile", Icon: FaRegUser, route: "/account/profile" },
        { title: "Delete history", Icon: RiHistoryFill, route: "/account/history" },
        { title: "Recover playlists", Icon: ListRestart, route: "/account/recover-playlists" }
    ];

    return (
        <section className="p-3 bg-neutral-800/80 rounded-lg space-y-6">
            <h3 className="font-bold text-2xl md:text-3xl px-2 select-none">Account</h3>
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
