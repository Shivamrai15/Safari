"use client";

import { usePathname } from "next/navigation";
import { MutableRefObject, useEffect } from "react";

interface PlayerShortCutProviderProps {
    onClick : () => void;
    audioRef : MutableRefObject<HTMLAudioElement | null>;
    play : boolean

}

export const PlayerShortCutProvider = ({
    onClick,
    audioRef,
    play
} : PlayerShortCutProviderProps ) => {

    const pathname = usePathname();
    
    useEffect(()=>{
        
        const innerWidth = window.innerWidth;

        const handleKeyPress = ( e : KeyboardEvent ) => {        
            if ( innerWidth > 720 && e.code === "Space" ) {
                if ( !pathname.includes("/search") ) {
                    e.stopPropagation();
                    e.preventDefault();
                    onClick();
                }
            }
        }
        

        document.addEventListener("keypress", handleKeyPress);

        return ()=>{
            document.removeEventListener("keypress", handleKeyPress);
        }

    }, [pathname, audioRef, play]);
    
    return null;
}
