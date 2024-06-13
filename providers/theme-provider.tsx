"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {

    React.useEffect(() => {
        const disableContextMenu = (event:MouseEvent) => {
            event.preventDefault();
        };
    
        const disableKeyCombinations = (event:KeyboardEvent) => {
            if (
                event.key === 'F12' ||
                (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key)) ||
                (event.ctrlKey && event.key === 'U')
            ) {
                event.preventDefault();
            }
        };
    
        document.addEventListener('contextmenu', disableContextMenu);
        document.addEventListener('keydown', disableKeyCombinations);
    
        return () => {
          document.removeEventListener('contextmenu', disableContextMenu);
          document.removeEventListener('keydown', disableKeyCombinations);
        };
        
    }, []);

    return <NextThemesProvider{...props}>
        {children}
    </NextThemesProvider>
}
