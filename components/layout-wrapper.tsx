"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "./navigation/sidebar";
import { MobileMenu } from "./navigation/mobile-menu";
import { Queue } from "./queue/queue";
import { useQueue } from "@/hooks/use-queue";
import { Player } from "./utils/player";

       
interface LayoutWrapperProps {
    children : React.ReactNode
}


export const LayoutWrapper = ({
    children
} : LayoutWrapperProps ) => {

    const { current } = useQueue();

    return (
        <main className={cn(
            "h-full w-full flex flex-col bg-neutral-950 overflow-x-hidden",     
        )}>
            <div className={cn(
                "h-[calc(100%-4rem)] md:h-full flex w-full",
                current && "h-[calc(100%-4rem)] md:h-[calc(100%-5rem)] "
            )}>
                <div className="hidden md:block w-24 flex-shrink-0 h-full bg-neutral-950/70">
                    <Sidebar/>
                </div>    
                <div className="w-full md:w-[calc(100%-2rem)] flex-1 h-full overflow-y-auto">
                    {children}
                    <Queue/>
                </div>
            </div>
            {
                current && (
                    <div className="w-full h-14 absolute bottom-[4.25rem] md:bottom-0 md:relative md:h-20">
                        <Player/>
                    </div>
                )
            }
            <div className="md:hidden w-full h-16 fixed bottom-0 bg-gradient-to-b from-transparent via-15% to-30% via-neutral-950/90 to-neutral-950">
                <MobileMenu/>
            </div>
        </main>
    )
}
