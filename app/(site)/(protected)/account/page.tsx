import { AccountSection } from "@/components/account/account-section";
import { PaymentSection } from "@/components/account/payment-section";


const AccountPage = () => {
    return (
        <main className="min-h-full w-full px-6 py-20 flex justify-center bg-gradient-to-b md:pr-32 from-neutral-800/80 via-50% to-90% via-neutral-900 to-neutral-950">
            <div className="max-w-4xl w-full space-y-10">
                <AccountSection/>
                <PaymentSection/>
            </div>
        </main>
    )
}

export default AccountPage;