"use client";

import { HelpCard } from "./help-card";
import { TiUser } from "react-icons/ti";
import { TbCardsFilled } from "react-icons/tb";
import { MdPrivacyTip } from "react-icons/md";
import { RiApps2Fill } from "react-icons/ri";

export const HelpOptions = () => {
    return (
        <div className="space-y-px" >
            <HelpCard
                title="Manage Account"
                icon={TiUser}
                href="/help/account"
            />
            <HelpCard
                title="Features and Settings"
                icon={RiApps2Fill}
                href="/help/features"
            />
            <HelpCard
                title="Payment and Billing"
                icon={TbCardsFilled}
                href="/help/payment"
            />
            <HelpCard
                title="Privacy and Security"
                icon={MdPrivacyTip}
                href="/help/privacy-and-security"
            />
        </div>  
    )
}
