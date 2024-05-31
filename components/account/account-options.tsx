"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccount } from "@/hooks/use-account";
import axios from "axios";
import { Check } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FaUser } from "react-icons/fa6";
import { toast } from "sonner";


export const AccountOptions = () => {

    const router =  useRouter();
    const [ loading, setLoading ] = useState(false);
    const { data , isLoading, mutate } : { 
        data : { 
            name: string | null,
            id: string,
            privateSession: boolean,
            isActive : boolean
        },
        isLoading: boolean,
        mutate : ()=>void
    } = useAccount();

    const togglePrivateSession = async () => {
        try {
            setLoading(true);
            await axios.patch("/api/v1/user/account", { privateSession : !data.privateSession });
            mutate();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
                <div className="bg-neutral-800 hover:bg-neutral-800/90 rounded-full h-11 w-11 flex items-center justify-center transition-colors md:cursor-pointer md:hover:scale-105">
                    <FaUser className="text-white h-5 w-5" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 p-1 rounded-sm shadow-lg bg-neutral-800 mt-2" align="end" side="bottom" >
                <DropdownMenuItem
                    className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    onClick={()=>router.push("/account")}
                >
                    Account
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    onClick={()=>router.push("/account/profile")}
                >
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    disabled = { loading || !data?.isActive }
                    onClick={togglePrivateSession}
                >
                    <span>Private Session</span>
                    { !isLoading && data.privateSession && (<Check className="ml-auto"/>) }
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    onClick={()=>router.push("/account/subscription")}
                    disabled = {data?.isActive}
                >
                    Upgrade to Premium
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                >
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-600"/>
                <DropdownMenuItem 
                    className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    onClick={()=>signOut({ callbackUrl : "/" })}
                >
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
