"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";


import { BellIcon } from "lucide-react";
import { BsIncognito } from "react-icons/bs";
import { AccountOptions } from "./account/account-options";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "@/hooks/use-account";


export const Header = () => {
    
    const router = useRouter();
    const session = useSession();
    const { data , isLoading, } : { 
        data : { 
            name: string | null,
            id: string,
            privateSession: boolean
        },
        isLoading: boolean,
    } = useAccount();

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
                    { 
                        !isLoading && data.privateSession && (
                            <Badge className="bg-green-600 hover:bg-green-600/90 text-white">
                                <BsIncognito className="h-6 w-6"/>
                            </Badge>
                        )
                    }
                    <Button
                        onClick={()=>signOut()}
                        className="rounded-full font-bold text-base px-6 hover:bg-red-500/80 hover:text-white"
                    >
                        Logout
                    </Button>
                    <AccountOptions/>
                </div>
            </div>
        )
    }
    
    return null;
    
}
