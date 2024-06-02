"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { GoHome, GoHomeFill } from "react-icons/go";
import { RiSearchFill, RiSearchLine } from "react-icons/ri";
import { FaRegCompass, FaCompass } from "react-icons/fa";
import { BsCollection, BsFillCollectionFill } from "react-icons/bs";
import { TbSquareRoundedPlus } from "react-icons/tb";
import { SidebarItem } from "./sidebar-item";
import { usePlaylistModal } from "@/hooks/use-playlist-modal";
import { PlaylistNav } from "./playlist-nav";
import { usePlaylist } from "@/hooks/use-playlist";
import { useAccount } from "@/hooks/use-account";
import { usePremiumModal } from "@/hooks/use-premium-modal";

export const Sidebar = () => {

    const pathname = usePathname();
    const router = useRouter();
    const session = useSession();
    const { onOpen } = usePlaylistModal();
    const { data } : { data : { isActive : boolean } } = useAccount();
    const playlist = usePlaylist();
    const { onOpenPremiumModal } = usePremiumModal();

    const handlePlaylistModal = () => {
        if ( session.status === "authenticated") {
            if (  data &&  data.isActive ) {
                onOpen();
            } else {
                if ( playlist.data && playlist.data.length < 5 ) {
                    onOpen();
                } else {
                    onOpenPremiumModal();
                }
            }
        }
    }

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
        <aside className="w-full flex flex-col items-center p-1 py-8 gap-y-6 h-full overflow-y-hidden">
            <div className="flex flex-col items-center gap-y-6">
                {
                    routes.map((route)=>(
                        <SidebarItem key={route.href} route={route} />
                    ))
                }
            </div>
            <div className="space-y-6">
                <div className="flex items-center justify-center">
                    <TbSquareRoundedPlus
                        className="h-8 w-8 md:cursor-pointer"
                        onClick={handlePlaylistModal}
                    />
                </div>
                <div
                    className="w-10 aspect-square relative rounded-sm cursor-pointer overflow-hidden"
                    onClick={()=>router.push("/liked-music")}
                >
                    <Image
                        src="/assets/liked-thumb.png"
                        fill
                        alt="Liked Songs"
                        className="object-cover"
                    />
                </div>
                {
                    session.status === "authenticated" && (
                        <PlaylistNav/>
                    )
                }
            </div>
        </aside>
    )
}
