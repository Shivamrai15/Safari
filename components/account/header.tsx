"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaChevronLeft, FaChevronRight  } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { AccountOptions } from "./account-options";


export const Header = () => {

    const router = useRouter();
    const pathname = usePathname();
    const [history, setHistory] = useState([pathname]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (history[currentIndex] !== pathname) {
        const newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(pathname);
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
        }
    }, [pathname]);


    useEffect(() => {
        const handlePopState = () => {
            const newIndex = history.findIndex(path => path === pathname);
            if (newIndex !== -1) {
                setCurrentIndex(newIndex);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [history, pathname]);

    const canGoBack = currentIndex > 0;
    const canGoForward = currentIndex < history.length - 1;
    
    return (
        <div className="h-20 overflow-hidden w-full max-w-3xl mx-auto flex items-center justify-between gap-x-4 px-6">
            <div className="flex items-center gap-x-6">
                <Button
                    className="rounded-full size-10 p-0"
                    size="icon"
                    onClick={()=>router.push("/")}
                >
                    <GoHomeFill className="size-6"/>
                </Button>
                <div className="flex items-center gap-x-3">
                    <Button
                        className="rounded-full size-10 p-0 bg-neutral-700"
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                            router.back();
                            setCurrentIndex(prev => Math.max(prev - 1, 0));
                          }}
                        disabled={!canGoBack}
                    >
                        <FaChevronLeft className="size-4"/>
                    </Button>
                    <Button
                        className="rounded-full size-10 p-0 bg-neutral-700"
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                            router.forward();
                            setCurrentIndex(prev => Math.min(prev + 1, history.length - 1));
                        }}
                        disabled={!canGoForward}
                    >
                        <FaChevronRight  className="size-4"/>
                    </Button>
                </div>
            </div>
            <AccountOptions/>
        </div>
    )
}
