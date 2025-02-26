"use client";

import { TbUserEdit } from "react-icons/tb";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { SectionItem } from "./section-item";
import { FingerprintIcon } from "lucide-react";



export const PrivacyAndSecurity = () => {

    const routes = [
        { title: "Edit Login Methods", Icon: TbUserEdit, route: "/account/edit-login-methods" },
        { title: "Privacy Policy", Icon: MdOutlinePrivacyTip, route: "/policies/privacy-policy" },
        { title: "Two Factor Authentication", Icon: FingerprintIcon, route: "/account/2fa" }
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
