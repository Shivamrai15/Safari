import { Metadata } from "next";
import { Suspense } from "react";
import { LinkAccounts } from "@/components/account/link-accounts";
import { Loader } from "@/components/utils/loader";


export const metadata : Metadata = {
    title : "Edit login methods"
}


const EditLoginMethods = () => {
    return (
        <main className="min-h-full w-full py-20 flex justify-center">
            <div className="w-full space-y-10">
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-5xl font-extrabold select-none">Edit login methods</h2>
                    <p className="text-zinc-400 font-medium select-none" >To ensure uninterrupted access to your account, it is recommended to configure multiple authentication methods.</p>
                </div>
                <Suspense fallback={<Loader/>} >
                    <LinkAccounts/>
                </Suspense>
            </div>
        </main>
    )
}

export default EditLoginMethods;