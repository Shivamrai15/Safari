import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

import { toast } from "sonner";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";


interface FromWrapperProps {
    label : string;
    socials? : boolean;
    disabled : boolean;
    children : React.ReactNode;
}

export const FormWrapper = ({
    label,
    socials,
    disabled,
    children
} : FromWrapperProps ) => {

    const [ loading, setLoading ] = useState(false);

    const handleLogIn = async( provider : "github" | "google" ) => {
        try {
            setLoading(true);
            await signIn(provider, {
                callbackUrl : "/"
            });

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-sm w-full p-6 space-y-10 mt-10 mb-4">
            <h1 className="text-3xl md:text-4xl font-extrabold select-none">
                {label} <br /> Safari Account
            </h1>
            {children}
            
            {
                socials && (
                    <>
                        <div className="relative">
                            <div className="w-full border" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 px-2 text-zinc-300 rounded-sm text-sm font-semibold cursor-default select-none" >Or</div>
                        </div>
                        <div className="w-full space-y-3">
                            <Button
                                className="w-full h-12"
                                disabled = {disabled}
                                onClick={() => handleLogIn("google")}
                                variant="secondary"
                            >
                                <FaGoogle className="h-4 w-4 mr-2" />
                                <span>Continue with Google</span>
                            </Button>
                            <Button
                                className="w-full h-12"
                                disabled = {disabled || loading}
                                onClick={()=>handleLogIn("github")}
                                variant="secondary"
                            >
                                <FaGithub className="h-4 w-4 mr-2" />
                                <span>Continue with Github</span>
                            </Button>
                        </div>
                    </>
                )
            }
            <footer className="h-40 flex w-full items-end">
                <div className="flex items-center justify-center w-full gap-x-3">
                    <Link
                        href="/policies/privacy-policy"
                        className="text-sm select-none text-zinc-200 hover:text-white transition-all"
                    >   
                        Privacy Policy
                    </Link>
                </div>
            </footer>
        </div>
    )
}
