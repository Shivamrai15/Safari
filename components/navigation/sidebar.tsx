"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { GoHome, GoHomeFill } from "react-icons/go";
import { RiSearchFill, RiSearchLine } from "react-icons/ri";
import { FaRegCompass, FaCompass, FaRegHeart, FaHeart } from "react-icons/fa";
import { TbSquareRoundedPlus, TbSquareRoundedPlusFilled } from "react-icons/tb";
import { SidebarItem } from "./sidebar-item";

export const Sidebar = () => {

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
            label : "Liked",
            href : "/liked-songs",
            Icon : pathname === "/liked-songs" ? FaHeart : FaRegHeart,
            active : pathname === "/liked-songs"
        },   
    ], [pathname]);

    return (
        <aside className="w-full h-full overflow-y-auto flex flex-col items-center p-2 py-8 gap-y-6">
            <div className="flex flex-col items-center gap-y-6">
                {
                    routes.map((route)=>(
                        <SidebarItem key={route.href} route={route} />
                    ))
                }
            </div>
            <div className="flex flex-col items-center gap-y-6">
                <TbSquareRoundedPlus className="h-8 w-8"/>
            </div>
        </aside>
    )
}
