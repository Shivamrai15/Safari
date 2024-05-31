"use client";

import { useRouter } from "next/navigation";
import { IoDiamond } from "react-icons/io5";

interface AccountSubscriptionCardProps {
    planName : string;
    expire : string;
    explorePlan : boolean;
    color : string
}

export const AccountSubscriptionCard = ({
    expire,
    explorePlan,
    planName,
    color
} : AccountSubscriptionCardProps ) => {

    const router = useRouter();

    return (
        <div className="w-full h-full bg-neutral-800 rounded-lg overflow-hidden cursor-default">
            <div className="h-20 w-full flex items-center space-x-6 px-4" style={{background : `${color}7a`}} >
                <IoDiamond className="h-6 w-6 text-white" />
                <h3 className="text-xl md:text-2xl font-extrabold select-none">
                    {planName}
                </h3>
            </div>
            <div className="h-60 w-full flex items-end">
                <div className="w-full flex items-center justify-between p-6">
                    <div>
                        <span className="text-zinc-200 font-semibold">Expires :</span>
                        <span className="pl-2 font-semibold">{expire}</span>
                    </div>
                    <div>
                        {
                            explorePlan && (
                                <div
                                    className="h-10 md:h-12 px-4 md:px-6 w-auto bg-neutral-700 flex items-center justify-center rounded-full border border-zinc-300 hover:scale-105 transition-all duration-300 font-semibold cursor-default md:cursor-pointer"
                                    onClick={()=>router.push("/account/subscription")}
                                >
                                    Explore Premium
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
