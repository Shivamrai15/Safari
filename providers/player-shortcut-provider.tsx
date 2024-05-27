"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface PlayerShortCutProviderProps {
    onClick : () => void;
}

export const PlayerShortCutProvider = ({
    onClick
} : PlayerShortCutProviderProps ) => {

    const pathname = usePathname();
    
    useEffect(()=>{
        
        const innerWidth = window.innerWidth;

        const handleKeyPress = ( e : KeyboardEvent ) => {        
            if ( innerWidth > 720 && e.code === "Space" ) {
                if ( !pathname.includes("/search") ) {
                    onClick();
                }
            }
        }
        

        document.addEventListener("keypress", handleKeyPress);

        return ()=>{
            document.removeEventListener("keypress", handleKeyPress);
        }

    }, [pathname]);
    
    return null;
}
