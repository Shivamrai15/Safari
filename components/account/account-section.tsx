"use client";


import { FaUser, FaHistory } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { SectionItem } from "./section-item";

export const AccountSection = () => {

    const routes = [
        { title: "Your profile", Icon: FaUser, route: "/account/profile" },
        { title: "Delete history", Icon: FaHistory, route: "/account/history" },
    ];

    return (
        <section className="p-6 bg-neutral-950/80 rounded-lg space-y-6">
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
