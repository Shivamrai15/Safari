"use client"

import { PlaylistModal } from "@/components/modals/playlist-modal";
import { useEffect, useState } from "react"

export const ModalProvider = () => {
    
    const [ isMounted, setIsMounted ] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    
    return (
        <>
            <PlaylistModal/>
        </>
    )
}
