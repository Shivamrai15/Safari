import { format } from "date-fns";
import { FaCrown } from "react-icons/fa6";
import { Button } from "../ui/button";

interface SubscriptionDetailsProps {
    subscription : {
        isActive: boolean | null;
        stripePriceId?: string | undefined;
        stripeCurrentPeriodEnd?: Date | undefined;
    } | null;
}


export const SubscriptionDetails = ({
    subscription
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
            color : "#323232"
        }
    }

    return (
        <div className="w-full bg-neutral-900 p-3 md:p-6 md:px-8 rounded-lg hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
            <div className="w-full flex flex-col gap-y-3 md:gap-y-5">
                <div className="flex items-center justify-between gap-x-4">
                    <span className="font-semibold select-none">Your plan</span>
                    <FaCrown
                        className="size-6"
                    />
                </div>
                <h2
                    className="text-3xl md:text-5xl lg:text-6xl font-extrabold w-fit bg-clip-text text-transparent select-none"
                    // @ts-ignore
                    style={{ "backgroundImage" : `linear-gradient(to right, #4a4a4a, ${subscription ? subscription.isActive ? priceLists[subscription.stripePriceId].color : "#e8e8e8" : "#e8e8e8"})` }}
                >
                    {
                        // @ts-ignore
                        subscription ? subscription.isActive ? `Safari ${priceLists[subscription.stripePriceId].planName}` : 'Safari Free' : 'Safari Free'
                    }
                </h2>
            </div>
            <div className="w-full flex items-center justify-end mt-8">
                {
                    !subscription?.isActive
                    ? (
                        <div className="font-medium text-sm select-none">
                            Expires on {format(subscription?.stripeCurrentPeriodEnd!, "dd MMM yyyy")}
                        </div>
                    )
                    : (
                        <Button
                            className="rounded-full bg-transparent font-bold border-neutral-700 hover:bg-neutral-700 border-[2px]"
                            variant="outline"
                        >
                            Choose a Plan
                        </Button>
                    ) 
                }
            </div>
            <div
                className="absolute inset-0 w-full h-full transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
                style={{
                    backgroundImage: "url(/assets/noise.webp)",
                    backgroundSize: "20%",
                }}
            />
        </div>
    )
}
