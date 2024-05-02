"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { FaUser } from "react-icons/fa";
import { BellIcon } from "lucide-react";


export const Header = () => {
    
    const router = useRouter();
    const session = useSession();

    if ( session.status === "unauthenticated" ) {
        return (
            <div className="px-4 md:px-10 h-28 flex items-center justify-end">
                <div className="flex items-center space-x-5">
                    <Button
                        onClick={()=>router.push("/login")}
                        className="hover:no-underline font-semibold text-zinc-300 hover:text-white text-base hover:scale-110 transition duration-150 " variant="link" >
                        Log In
                    </Button>
                    <Button
                        onClick={()=>router.push("/get-started")}
                        className="rounded-full font-bold text-base px-6 hover:bg-red-500/80 hover:text-white"
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        )
    }

    if ( session.status === "authenticated" ) {
        return (
            <div className="px-4 md:px-10 h-28 flex items-center justify-end">
                <div className="flex items-center space-x-5">
                    <BellIcon/>
                    <Button
                        onClick={()=>signOut()}
                        className="rounded-full font-bold text-base px-6 hover:bg-red-500/80 hover:text-white"
                    >
                        Logout
                    </Button>
                    <div className="bg-neutral-800 hover:bg-neutral-800/90 rounded-full h-11 w-11 flex items-center justify-center transition-colors md:cursor-pointer md:hover:scale-105">
                        <FaUser className="text-white h-5 w-5" />
                    </div>
                </div>
            </div>
        )
    }
    
    return null;
    
}
