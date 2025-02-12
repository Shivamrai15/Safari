"use client";

import { TbUserEdit } from "react-icons/tb";
import { SectionItem } from "./section-item";



export const PrivacyAndSecurity = () => {

    const routes = [
        { title: "Edit Login Methods", Icon: TbUserEdit, route: "/account/edit-login-methods" },
    ]

    return (
        <div className="p-3 bg-neutral-800/80 rounded-lg space-y-6">
            <h3 className="font-bold text-2xl md:text-3xl px-2 select-none">Privacy and Security</h3>
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
        </div>
    )
}
