import { TwoFactorAuthentication } from "@/components/account/2fa";
import { Metadata } from "next";

export const metadata : Metadata = {
    title: "Two Factor Authentication",
    description: "Enable two factor authentication to secure your account",
    keywords: "2fa, two factor authentication, security, account security"
}


const Page = async() => {
    
    return (
        <main className="min-h-full w-full py-20 flex justify-center">
            <div className="w-full space-y-16">
                <h2 className="text-3xl md:text-4xl font-extrabold select-none">Two Factor Authentication</h2>
                <TwoFactorAuthentication/>
            </div>
        </main>
    )
}

export default Page