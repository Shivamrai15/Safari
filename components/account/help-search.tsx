"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export const HelpSearchInput = () => {
    return (
        <div className="w-full">
            <div className="w-full py-2 h-14 md:h-16 px-4 md:px-6 bg-neutral-800/80 flex items-center gap-x-2">
                <SearchIcon className="size-6 md:size-7" />
                <Input
                    className="w-full h-full md:text-lg rounded-3xl px-2 focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-transparent placeholder-zinc-300 focus:placeholder-zinc-400"
                    placeholder="Search for help"
                />
            </div>
        </div>
    )
}
