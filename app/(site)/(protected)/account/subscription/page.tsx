"use client";

import Link from "next/link";
import { SubscribeBtn } from "@/components/account/subscribe-btn";
import { SubscriptionCard } from "@/components/account/subscription-card"
import { FaCircleCheck } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";


const SubscriptionPage = () => {
    return (
        <div className="pb-20 md:pb-10 bg-neutral-900 min-h-full space-y-10 md:space-y-20 scroll-smooth" >
            <header className="px-6 flex justify-center md:pr-32 bg-gradient-to-b from-[#a6655f92] to-50% to-neutral-900 py-20">
                <div className="max-w-3xl w-full">
                    <div className="max-w-sm md:max-w-2xl w-full space-y-8">
                        <div className="w-full space-y-4">
                            <p className="w-full text-2xl md:text-5xl font-bold select-none">
                                Skip the ads, unlock everything. Try 2 months of Premium for ₹189.
                            </p>
                            <span className="font-semibold md:text-lg text-zinc-400 block select-none">Cancel anytime*</span>
                        </div>
                        <div className="w-full flex items-center gap-x-6 md:gap-x-10">
                            <SubscribeBtn onClick={()=>{}} label="Get Premium" className="max-w-64 w-full bg-[#ff9e95] hover:bg-[#ffccc7]" />
                            <Link 
                                href="/account/subscription#plans" 
                                className="text-base font-semibold hover:underline duration-300 transition-all select-none"
                            >
                                View All Plans
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            <main className="px-6 flex justify-center md:pr-32">
                <article className="max-w-xl w-full space-y-12">
                    <header>
                        <h2 className="text-2xl md:text-4xl font-bold text-center select-none">Feel the Premium</h2>
                    </header>
                    <table className="w-full space-y-4">
                        <thead>
                            <tr className="grid grid-cols-5 text-lg font-semibold py-3 border-b-2 border-zinc-400 select-none">
                                <th className="col-span-3"></th>
                                <th>Free Plan</th>
                                <th>Premium</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="grid grid-cols-5 py-3 border-b-2">
                                <td className="col-span-3 text-base font-medium cursor-default select-none">Ad-Free Experience</td>
                                <td className="w-full flex items-center justify-center text-zinc-400" ><FaMinus/></td>
                                <td className="w-full flex items-center justify-center" ><FaCircleCheck className="h-6 w-6"/></td>
                            </tr>
                            <tr className="grid grid-cols-5 py-3 border-b-2">
                                <td className="col-span-3 text-base font-medium cursor-default select-none">Unlimited Skips</td>
                                <td className="w-full flex items-center justify-center text-zinc-400" ><FaMinus/></td>
                                <td className="w-full flex items-center justify-center" ><FaCircleCheck className="h-6 w-6"/></td>
                            </tr>
                            <tr className="grid grid-cols-5 py-3 border-b-2">
                                <td className="col-span-3 text-base font-medium cursor-default select-none">Organize queue</td>
                                <td className="w-full flex items-center justify-center text-zinc-400" ><FaMinus/></td>
                                <td className="w-full flex items-center justify-center" ><FaCircleCheck className="h-6 w-6"/></td>
                            </tr>
                            <tr className="grid grid-cols-5 py-3 border-b-2">
                                <td className="col-span-3 text-base font-medium cursor-default select-none">Play songs in any order</td>
                                <td className="w-full flex items-center justify-center text-zinc-400" ><FaMinus/></td>
                                <td className="w-full flex items-center justify-center" ><FaCircleCheck className="h-6 w-6"/></td>
                            </tr>
                            <tr className="grid grid-cols-5 py-3 border-b-2">
                                <td className="col-span-3 text-base font-medium cursor-default select-none">Song seek control</td>
                                <td className="w-full flex items-center justify-center text-zinc-400" ><FaMinus/></td>
                                <td className="w-full flex items-center justify-center" ><FaCircleCheck className="h-6 w-6"/></td>
                            </tr>
                            <tr className="grid grid-cols-5 py-3 border-b-2">
                                <td className="col-span-3 text-base font-medium cursor-default select-none">Unlimted custom playlists</td>
                                <td className="w-full flex items-center justify-center text-zinc-400" ><FaMinus/></td>
                                <td className="w-full flex items-center justify-center" ><FaCircleCheck className="h-6 w-6"/></td>
                            </tr>
                        </tbody>
                    </table>
                    <section id="plans" className="pt-10">
                        <p className="text-2xl md:text-4xl font-bold text-center select-none">
                            Choose a plan that fits you
                        </p>
                    </section>
                </article>    
            </main>
            <div className="flex justify-center w-full px-6 pb-20 md:pr-32">
                <div className="max-w-2xl w-full space-y-12">
                    <div className="grid sm:grid-cols-2 gap-10">
                        <SubscriptionCard color="#ff9e95" priceId="price_1PLVQoSF9kH75ipG3YQe4k4Y" title="Basic" price= "₹99 for 1 month " />
                        <SubscriptionCard color="#8bf76a" priceId="price_1PLVX8SF9kH75ipGU9rTB5HC" title="Lite" price= "₹189 for 2 month " />
                        <SubscriptionCard color="#ffa875" priceId="price_1PLVZkSF9kH75ipG33UoFPOx" title="Elite" price= "₹499 for 6 month " />
                        <SubscriptionCard color="#a96af7" priceId="price_1PLVcJSF9kH75ipGigh23CQ9" title="Prime" price= "₹899 for 12 month " />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionPage;