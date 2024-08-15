"use client";

import { useScroll, motion, useTransform } from "framer-motion";

interface HeaderProps {
    name : string;
}

export const Header = ({
    name
} : HeaderProps ) => {

    const { scrollY } = useScroll();

    
    const boxShadow = useTransform(scrollY, [0, 100], ["0px 0px 0px #eb4034", "0px 4px 20px #eb4034"]);

    return (
        <motion.header
            style={{boxShadow}}
            className="py-10 px-4 md:px-20 md:pr-32 sticky top-0 bg-[#121212] z-10"

        >
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold" >{name}</h2>
            </div>
        </motion.header>
    )
}
