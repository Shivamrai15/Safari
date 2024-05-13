"use client";

import { History } from "lucide-react";

interface HistoryHeader {
    label : string | null;
}

export const HistoryHeader = ({
    label
} : HistoryHeader ) => {
    
    if (!label) {
        return null;
    }

    return (
        <div className="w-full flex items-center gap-x-5 pt-14 md:pt-16">
            <div className="shrink-0 h-12 w-12 flex items-center justify-center bg-neutral-800 rounded-full">
                <History className="text-red-500"/>
            </div>
            <h3 className="w-full text-xl sm:text-2xl md:text-3xl font-bold">
                {label}
            </h3>
        </div>
    )
}
