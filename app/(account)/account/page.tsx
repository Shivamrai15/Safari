import { AccountSection } from "@/components/account/account-section";
import { HelpSection } from "@/components/account/help-section";
import { PaymentSection } from "@/components/account/payment-section";
import { PrivacyAndSecurity } from "@/components/account/privacy-and-security";
import { Status } from "@/components/account/status";
import { Metadata } from "next";


export const metadata : Metadata = {
    title : "Account"
}


const AccountPage = () => {
    return (
        <main className="min-h-full overflow-y-auto w-full py-20 flex justify-center">
            <div className="space-y-6 w-full">
                <AccountSection/>
                <PaymentSection/>
                <PrivacyAndSecurity/>
                <Status/>
                {/* <HelpSection/> */}
            </div>
        </main>
    )
}

export default AccountPage;