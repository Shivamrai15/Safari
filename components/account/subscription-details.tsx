import { AccountSubscriptionCard } from "./account-subscription-card";
import { format } from "date-fns"

interface SubscriptionDetailsProps {
    subscription : string;
    expire? : Date
}


export const SubscriptionDetails = ({
    subscription,
    expire
} : SubscriptionDetailsProps) => {
    
    const priceLists = {
        "price_1PLVQoSF9kH75ipG3YQe4k4Y" : {
            planName : "Basic",
            color : "#ff9e95",
        },
        "price_1PLVX8SF9kH75ipGU9rTB5HC" : {
            planName : "Lite",
            color : "#8bf76a",
        },
        "price_1PLVZkSF9kH75ipG33UoFPOx" : {
            planName : "Elite",
            color : "#ffa875",
        },
        "price_1PLVcJSF9kH75ipGigh23CQ9" : {
            planName : "Prime",
            color : "#a96af7",
        },
        "free" : {
            planName : "Free",
            color : "323232"
        }
    }

    return (
        <section className="max-w-lg w-full">
            <AccountSubscriptionCard
                // @ts-ignore
                planName={priceLists[subscription].planName}
                expire={expire ?  format(expire , "dd MMMM yyyy"): "Never"}
                explorePlan={subscription==="free"}
                // @ts-ignore
                color={priceLists[subscription].color}
            />
        </section>
    )
}
