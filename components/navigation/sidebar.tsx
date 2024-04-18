"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

import { GoHome, GoHomeFill } from "react-icons/go";
import { RiSearchFill, RiSearchLine } from "react-icons/ri";
import { FaRegCompass, FaCompass } from "react-icons/fa";
import { BsCollection, BsFillCollectionFill } from "react-icons/bs";
import { TbSquareRoundedPlus } from "react-icons/tb";
import { SidebarItem } from "./sidebar-item";
import Image from "next/image";

export const Sidebar = () => {

    const pathname = usePathname();
    const router = useRouter();

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
        <aside className="w-full h-full overflow-y-auto flex flex-col items-center p-1 py-8 gap-y-6">
            <div className="flex flex-col items-center gap-y-6">
                {
                    routes.map((route)=>(
                        <SidebarItem key={route.href} route={route} />
                    ))
                }
            </div>
            <div className="flex flex-col items-center gap-y-6">
                <TbSquareRoundedPlus className="h-8 w-8"/>
                <div
                    className="w-10 aspect-square relative rounded-sm cursor-pointer overflow-hidden"
                    onClick={()=>router.push("/liked-songs")}
                >
                    <Image
                        src="/assets/liked-thumb.png"
                        fill
                        alt="Liked Songs"
                        className="object-cover"
                    />
                </div>
            </div>
        </aside>
    )
}
