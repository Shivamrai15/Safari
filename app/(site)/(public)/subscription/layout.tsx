import { getUserSubscription } from "@/server/queries";
import { redirect } from "next/navigation";

interface SubscriptionLayoutProps {
    children : React.ReactNode;
}

const SubscriptionLayout = async({
    children
} : SubscriptionLayoutProps ) => {
    
    const subscription = await getUserSubscription();
    if ( subscription && !!subscription.isActive ) {
        return redirect("/")
    }

    return (
        <div>{children}</div>
    )
}

export default SubscriptionLayout