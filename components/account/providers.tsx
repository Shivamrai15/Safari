"use client";

import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaGoogle } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


interface ProvidersProps {
    provider : "google"|"github"|"email" | string;
    current : boolean;
}


export const Providers = ({ current, provider }: ProvidersProps) => {
    
    const [loading, setLoading] = useState(false);
    const handleLogin = ()=>{
        try {
            setLoading(true);
            if ( !current ) {
                signIn(provider)
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <Button
            className={cn(
                "h-14 w-full flex items-center gap-x-4 bg-neutral-800 px-3 rounded-md focus:outline-none relative cursor-default transition-all justify-start",
                !current && "hover:bg-neutral-700/80 md:cursor-pointer"
            )}
            disabled={loading}
            variant="ghost"
            onClick={handleLogin}
        >
            {
                provider === "email"
                ? (<MdEmail className="size-5" />)
                : provider === "google"
                ? (<FaGoogle className="size-5" />)
                : (<FaGithub className="size-5" />)
            }
            <span className="font-medium select-none" >{provider[0].toUpperCase()+provider.slice(1)}</span>
        </Button>
    )
}
