"use client";

import { useRouter } from "next/navigation";
import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { postData } from "@/lib/helpers";
import { toast } from "sonner";

interface SectionItemProps {
    title : string;
    Icon : IconType | LucideIcon;
    route : string;
}

export const SectionItem = ( {
    title,
    Icon,
    route
} : SectionItemProps ) => {
    
    const router = useRouter();
    const [ loading, setLoading ] = useState(false);

    const handleRoutes = async() => {
        if ( route === "account::manage" ) {
            try {
                setLoading(true);
                const  { url } = await postData({
                    url : "/api/create-portal-link",
                });
                window.location.assign(url);
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
            } finally {
                setLoading(false);
            }
        } else {
            router.push(route);
        }
    }

    return (
        <li 
            className="flex group items-center justify-between p-2 rounded-md hover:bg-neutral-900 md:cursor-pointer select-none"
            onClick={handleRoutes}
            aria-disabled = { loading }
        >
            <div className="flex items-center gap-x-4 text-zinc-300 group-hover:text-zinc-100 transition-all">
                <div className="h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center bg-neutral-700">
                    <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold select-none">
                    {title}
                </h3>
            </div>
            <div className="h-8 w-8 flex items-center">
                <ChevronRight className="text-zinc-400 group-hover:text-zinc-100 transition-all"/>
            </div>
        </li>
    )
}
