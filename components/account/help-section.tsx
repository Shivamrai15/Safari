"use client";
import { CircleHelp } from "lucide-react";
import { SectionItem } from "./section-item";


export const HelpSection = () => {

    const routes = [
        { title : "Safari support", Icon : CircleHelp, route : "/help" }
    ]

    return (
        <section className="p-3 bg-neutral-800/80 rounded-lg space-y-6">
            <h3 className="font-bold text-2xl md:text-3xl px-2 select-none">Help</h3>
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
