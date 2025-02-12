import { AccountSection } from "@/components/account/account-section";
import { PaymentSection } from "@/components/account/payment-section";
import { PrivacyAndSecurity } from "@/components/account/privacy-and-security";


const AccountPage = () => {
    return (
        <main className="min-h-full overflow-y-auto w-full py-20 flex justify-center">
            <div className="space-y-6 w-full">
                <AccountSection/>
                <PaymentSection/>
                <PrivacyAndSecurity/>
            </div>
        </main>
    )
}

export default AccountPage;