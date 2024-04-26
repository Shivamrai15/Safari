"use client";

import { BellIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";


export const Header = () => {
    
    const router = useRouter();
    
    return (
        <div className="px-4 md:px-10 h-28 flex items-center justify-end">
            <div className="flex items-center space-x-5">
                <div className="flex items-center space-x-3">
                    <button className="h-9 w-9 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-900 transition">
                        <ChevronLeft/>                    
                    </button>
                    <button className="h-9 w-9 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-900 transition" >
                        <ChevronRight/>
                    </button>
                </div>
                <BellIcon/>
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
