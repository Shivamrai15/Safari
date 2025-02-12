"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TriangleAlertIcon } from "lucide-react";


const AuthError = () => {
    
    const router = useRouter();

    return (
        <main className="w-full h-full flex flex-col items-center justify-center p-6">
            <TriangleAlertIcon className="text-zinc-300 size-12"/>            
            <h1 className="text-sm font-semibold text-zinc-300 mt-4 select-none">
                Oops something went wrong!
            </h1>
            <Button
                className="mt-5"
                size="sm"
                variant="ghost"
                onClick={()=>router.push("/login")}
            >
                Back to Login
            </Button>
        </main>
    )
}

export default AuthError;