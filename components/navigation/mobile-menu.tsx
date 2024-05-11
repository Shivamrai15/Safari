"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { GoHome, GoHomeFill } from "react-icons/go";
import { RiSearchFill, RiSearchLine } from "react-icons/ri";
import { FaRegCompass, FaCompass } from "react-icons/fa";
import { BsCollection, BsFillCollectionFill } from "react-icons/bs";
import { SidebarItem } from "./sidebar-item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export const MobileMenu = () => {

    const pathname = usePathname();
    const router = useRouter();
    const session = useSession();

    const routes = useMemo(()=>[
        {
            label : "Home",
            href : "/",
            Icon : pathname === "/" ? GoHomeFill : GoHome,
            active : pathname === "/"
        },   
        {
            label : "Search",
            href : "/search",
            Icon : pathname === "/search" ? RiSearchFill : RiSearchLine,
            active : pathname === "/search"
        },   
        {
            label : "Browse",
            href : "/browse",
            Icon : pathname === "/browse" ? FaCompass : FaRegCompass,
            active : pathname === "/browse"
        },   
        {
            label : "Playlist",
            href : "/playlists",
            Icon : pathname === "/playlists" ? BsFillCollectionFill : BsCollection,
            active : pathname === "/playlists"
        },  
    ], [pathname]);

    return (
        <div className="flex items-center h-full w-full">
            <div className="grid grid-cols-5 w-full place-items-center">
                {
                    routes.map((route)=>(
                    <div key={route.href} className="flex items-center justify-center h-full w-full">
                        <SidebarItem route={route} />
                    </div>
                    ))
                }
                <div className="flex items-center justify-center h-full w-full">
                    <Avatar className="h-7 w-7 ring-2 ring-neutral-900" onClick={()=>router.push("/account")} >
                        <AvatarImage  src={session.data?.user?.image || ""} />
                        <AvatarFallback className="text-xs bg-red-800" >
                            { session.data?.user?.name?.charAt(0).toUpperCase() || "S" }
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>  
        </div>
    )
}
