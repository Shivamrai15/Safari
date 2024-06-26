"use client";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchTabProps {
    url : string;
    label : string;
    active : boolean;
    query : string;
}

export const SearchTab = ({
    label,
    url,
    active,
    query
} : SearchTabProps ) => {

    const router = useRouter();

    return (
        <Button
            onClick={()=>router.push(`${url}?query=${query}`)}
            className={cn(
                "rounded-full font-bold",
                !active && "bg-neutral-800 hover:bg-neutral-800/80 text-zinc-300"
            )}
        >
            {label}
        </Button>
    )
}
