import { cn } from "@/lib/utils";
import { FaGoogle, FaFacebookSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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
    return (
        <div className="max-w-sm w-full p-6 space-y-10">
            <h1 className="text-3xl md:text-4xl font-extrabold">
                {label} <br /> Safari Account
            </h1>
            {children}
            
            {
                socials && (
                    <>
                        <div className="relative">
                            <div className="w-full border" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2 text-zinc-300 rounded-sm" >Or</div>
                        </div>
                        <div className="w-full grid grid-cols-3 place-items-center gap-3">
                            <button
                                className={cn(
                                    "aspect-[5/3] h-full w-full bg-neutral-900 rounded-sm border flex items-center justify-center hover:bg-neutral-900/80 transition cursor-default md:cursor-pointer",
                                    disabled && "cursor-default opacity-70 hover:bg-neutral-900"
                                )}
                                disabled = {disabled}
                            >
                                <FaGoogle className="h-7 w-7" />
                            </button>
                            <button
                                className={cn(
                                    "aspect-[5/3] h-full w-full bg-neutral-900 rounded-sm border flex items-center justify-center hover:bg-neutral-900/80 transition cursor-default md:cursor-pointer",
                                    disabled && "cursor-default opacity-70 hover:bg-neutral-900"
                                )}
                                disabled = {disabled}
                            >
                                <FaFacebookSquare className="h-7 w-7" />
                            </button>
                            <button
                                className={cn(
                                    "aspect-[5/3] h-full w-full bg-neutral-900 rounded-sm border flex items-center justify-center hover:bg-neutral-900/80 transition cursor-default md:cursor-pointer",
                                    disabled && "cursor-default opacity-70 hover:bg-neutral-900"
                                )}
                                disabled = {disabled}
                            >
                                <FaXTwitter className="h-7 w-7" />
                            </button>
                        </div>
                    </>
                )
            }
        </div>
    )
}
