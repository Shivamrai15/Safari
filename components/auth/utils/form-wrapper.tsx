import { cn } from "@/lib/utils";
import { FaGoogle, FaFacebookSquare, FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useState } from "react";


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

    const handleLogIn = async( provider : "github" | "google" | "facebook" ) => {
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
        <div className="max-w-sm w-full p-6 space-y-10 my-10">
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
                        <div className="w-full grid grid-cols-2 place-items-center gap-3">
                            <button
                                className={cn(
                                    "aspect-[8/3] h-full w-full bg-neutral-950/40 rounded-sm border flex items-center justify-center hover:bg-neutral-950/20 transition cursor-default md:cursor-pointer",
                                    disabled && "cursor-default opacity-70 hover:bg-neutral-950/20 md:cursor-default"
                                )}
                                disabled = {disabled}
                                onClick={() => handleLogIn("google")}
                            >
                                <FaGoogle className="h-7 w-7" />
                            </button>
                            <button
                                className={cn(
                                    "aspect-[8/3] h-full w-full bg-neutral-950/40 rounded-sm border flex items-center justify-center hover:bg-neutral-950/20 transition cursor-default md:cursor-pointer",
                                    disabled && "cursor-default opacity-70 hover:bg-neutral-950/20 md:cursor-default"
                                )}
                                disabled = {disabled || loading}
                                onClick={()=>handleLogIn("github")}
                            >
                                <FaGithub className="h-7 w-7" />
                            </button>
                        </div>
                    </>
                )
            }
        </div>
    )
}
