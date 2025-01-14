"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'

export const ProgressProvider = () => {
    
    const router = useRouter();
    const pathname = usePathname();
    const progress = JSON.parse(`${process.env.NEXT_PUBLIC_PROGRESS}`);

    useEffect(()=>{
        if (progress) {
            router.push("/progress");
        }
    }, [pathname, progress]);
    
    return (
        null
    )
}
