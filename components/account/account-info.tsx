"use client";

import { useSubscribers } from "@/hooks/use-subscribers";
import Link from "next/link";

export const AccountInfo = () => {
    
    const { data, isLoading } = useSubscribers();
    
    if ( isLoading ) {
        return null;
    }

    return (
        <Link 
            className="flex items-center gap-x-6 font-semibold hover:underline transition-all"
            href="/account/following"
        >
            <span>
                {data.length} Following
            </span>
        </Link>
    )
}
