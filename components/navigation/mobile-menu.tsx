"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { GoHome, GoHomeFill } from "react-icons/go";
import { RiSearchFill, RiSearchLine } from "react-icons/ri";
import { FaRegCompass, FaCompass, FaRegUser, FaUser } from "react-icons/fa";
import { BsCollection, BsFillCollectionFill } from "react-icons/bs";
import { SidebarItem } from "./sidebar-item";

export const MobileMenu = () => {

    const pathname = usePathname();

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
        {
            label : "Account",
            href : "/account",
            Icon : pathname === "/account" ? FaUser : FaRegUser,
            active : pathname === "/account"
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
            </div>  
        </div>
    )
}
