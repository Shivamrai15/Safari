"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import axios from "axios";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccount } from "@/hooks/use-account";
import { Check } from "lucide-react";

import { FaUser } from "react-icons/fa6";
import { toast } from "sonner";
import { KeyedMutator } from "swr";
import { AccountResponse } from "@/types";


export const AccountOptions = () => {

    const router =  useRouter();
    const [ loading, setLoading ] = useState(false);
    const { data , isLoading, mutate } : { 
        data : AccountResponse,
        isLoading: boolean,
        mutate : KeyedMutator<any>
    } = useAccount();

    const togglePrivateSession = async () => {
        try {
            setLoading(true);
            await axios.patch("/api/v1/user/account", { privateSession : !data.privateSession, showRecommendations : data.showRecommendations });
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
                    onClick={()=>router.push("/listen-with-friends")}
                    disabled = {loading || !data?.isActive}
                >
                    Listen with friends
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="px-3 hover:bg-neutral-700 focus:bg-neutral-700 py-2 rounded-none md:cursor-pointer"
                    onClick={()=>router.push("/subscription")}
                    disabled = {data?.isActive}
                >
                    Upgrade to Premium
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
