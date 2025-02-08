import { AccountSection } from "@/components/account/account-section";
import { PaymentSection } from "@/components/account/payment-section";


const AccountPage = () => {
    return (
        <main className="min-h-full overflow-y-auto w-full py-20 flex justify-center">
            <div className="space-y-10 w-full">
                <AccountSection/>
                <PaymentSection/>
            </div>
        </main>
    )
}

export default AccountPage;