"use client"

import { useEffect, useState } from "react";
import { PlaylistModal } from "@/components/modals/playlist-modal";
import { JoinPremiumModal } from "@/components/modals/join-premium-modal";
import { TwoFactorEnableModal } from "@/components/modals/2fa-enable-modal";

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
            <JoinPremiumModal/>
            <TwoFactorEnableModal/>
        </>
    )
}
