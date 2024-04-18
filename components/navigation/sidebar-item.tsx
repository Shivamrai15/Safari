"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { IconType } from "react-icons"

interface SidebarItemProps {
    route : {
        label : string,
        href : string,
        Icon : IconType,
        active : boolean
    }
}

export const SidebarItem = ({
    route
} : SidebarItemProps ) => {

    const router = useRouter();

    return (
        <div className={cn(
                "text-zinc-400 md:hover:text-white transition-colors cursor-default md:cursor-pointer",
                route.active && "text-white"
            )}
            onClick={()=>router.push(route.href)}
        >
            { <route.Icon className={cn(
                "h-7 w-7",
                route.href === "/user" && "h-[26px] w-[26px]"
            )} /> }
        </div>
    )
}
