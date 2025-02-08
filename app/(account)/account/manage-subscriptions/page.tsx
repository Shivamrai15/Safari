import { Subscriptions } from "@/components/account/subscriptions";
import { Metadata } from "next";

export const metadata: Metadata = {
    title : "Manage subscriptions - Safari"
}


const SubscriptionsPage = () => {
    return (
        <main className="min-h-full w-full py-20">
            <div className="space-y-16 w-full">
                <h2 className="text-3xl md:text-5xl font-extrabold select-none" >Transaction history</h2>
                <Subscriptions/>
            </div>
        </main>
    )
}

export default SubscriptionsPage;