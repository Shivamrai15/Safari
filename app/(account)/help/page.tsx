
import { Metadata } from "next";
import { HelpSearchInput } from "@/components/account/help-search"
import { HelpOptions } from "@/components/account/help";


export const metadata : Metadata = {
    title: "Help",
    description: "Help page for the Safari web app",
}

const HelpPage = () => {
    return (
        <main className="w-full pt-16 md:pt-20 pb-20 md:pb-10 min-h-full scroll-smooth space-y-20">
            <div className="space-y-8">
                <h1 className="text-3xl md:text-5xl font-extrabold select-none" >How we can help you?</h1>
                <HelpSearchInput/>
            </div>
            <HelpOptions/>
        </main>
    )
}

export default HelpPage;