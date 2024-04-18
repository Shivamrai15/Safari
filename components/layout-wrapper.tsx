"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "./navigation/sidebar";
import { MobileMenu } from "./navigation/mobile-menu";

       
interface LayoutWrapperProps {
    children : React.ReactNode
}


export const LayoutWrapper = ({
    children
} : LayoutWrapperProps ) => {
    return (
        <main className={cn(
            "h-full w-full flex flex-col md:flex-row bg-neutral-950 overflow-x-hidden",     
        )}>
            <div className="hidden md:block w-24 flex-shrink-0 h-full bg-neutral-950/70">
                <Sidebar/>
            </div>    
            <div className="w-full md:w-[calc(100%-2rem)] flex-1 h-[calc(100%-4rem)] md:h-full overflow-y-auto">
                {children}
            </div>
            <div className="md:hidden w-full h-16 fixed bottom-0 bg-gradient-to-b from-transparent via-15% to-30% via-neutral-950/90 to-neutral-950">
                <MobileMenu/>
            </div>
        </main>
    )
}
