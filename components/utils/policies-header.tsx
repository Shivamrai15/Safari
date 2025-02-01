"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { AccountOptions } from "../account/account-options";


interface PoliciesHeaderProps {
    isAuthenticated : boolean;
}

export const PoliciesHeader = ({
    isAuthenticated
}: PoliciesHeaderProps ) => {

    const { scrollYProgress } = useScroll();
    const [visible, setVisible] = useState(true);

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        if (typeof current === "number") {
            let direction = current! - scrollYProgress.getPrevious()!;
     
            if ( scrollYProgress.get() < 0.03 ) {
                setVisible(true);
            }
            else {
                if (direction < 0) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }
        }
    });
    

    return (
        <AnimatePresence mode="wait">
            <motion.header
                className="h-16 w-full sticky top-0 px-6 sm:px-12 backdrop-blur-xl"
                initial={{
                    opacity: 1,
                    y: 0,
                }}
                animate={{
                    y: visible ? 0 : -100,
                }}
                transition={{
                    duration: 0.5,
                }}
            >
                <div className="w-full h-full max-w-5xl mx-auto flex items-center justify-between">
                    <Link
                        className="h-9 aspect-square relative"
                        href="/"
                    >
                        <Image
                            src="/assets/icon.light.png"
                            alt="Logo"
                            className="object-contain"
                            fill
                        />
                    </Link>
                    <div className="flex items-center gap-x-6">
                        <Link
                            href="/account/subscription"
                            className="font-semibold text-zinc-300 hover:text-white transition-all"
                        >
                            Premium
                        </Link>
                        {
                            isAuthenticated ? (<AccountOptions/>) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="font-semibold text-zinc-300 hover:text-white transition-all"
                                    >
                                        Log in
                                    </Link>
                                    <div className="h-5 w-0.5 rounded-full bg-zinc-300" />
                                    <Link
                                        href="/sign-up"
                                        className="font-semibold text-zinc-300 hover:text-white transition-all"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )
                        }
                    </div>
                </div>
            </motion.header>
        </AnimatePresence>
    )
}
