"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { TiChevronRight } from "react-icons/ti";


interface HelpCardProps {
    icon : LucideIcon| IconType
    title : string;
    href : string;
    className ?: string;
}

export const HelpCard = ({
    icon : Icon,
    title,
    href,
    className,
} : HelpCardProps ) => {

    const router = useRouter();

    return (
        <div 
            className={cn(
                "w-full relative bg-neutral-800/80 group hover:bg-neutral-800 transition-all p-4 py-3 flex items-center justify-between gap-x-3 cursor-default md:cursor-pointer",
                className
            )}
            onClick={() => router.push(href)}
        >
            <div className="flex items-center gap-x-3">
                <Icon className="text-primary-500 size-6 text-zinc-400 group-hover:text-white"/>
                <h2 className="text-base font-semibold text-zinc-400 group-hover:text-white select-none">{title}</h2>
            </div>
            <TiChevronRight className="size-5 text-zinc-400 group-hover:text-white" />
        </div>
    )
}
