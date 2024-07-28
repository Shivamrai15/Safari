"use client";

import {
    AnimatePresence,
    motion
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrashIcon } from "lucide-react";
import { useQueue } from "@/hooks/use-queue";


interface DeleteMiniModalProps {
    ids : string[];
    open : boolean;
    close : ()=>void
}

export const DeleteMiniModal = ({
    ids,
    open,
    close
} : DeleteMiniModalProps ) => {


    const { remove } = useQueue();

    const handleRemove = ()=>{
        ids.forEach((id)=>{
            remove(id);
        });
        close();
    }

    return (
        <AnimatePresence>
            {
                open && (
                    <motion.div
                        initial = {{
                            opacity : 0,
                            y : -50,
                        }}
                        animate = {{
                            opacity : 1,
                            y : 0,
                        }}
                        exit={{
                            opacity : 0,
                            y : -50,
                        }}
                        className="fixed top-10 w-full h-auto rounded-sm z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{
                                scale: 0.5,
                            }}
                            animate={{
                                scale: 1,
                            }}
                            exit={{
                                scale: 0.5,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 15,
                            }}

                            className="w-32 bg-[#171717] p-2 rounded-xl shadow-lg flex items-center justify-center border gap-x-3"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="flex-col items-center justify-center space-y-0.5"
                                onClick={close}
                            >
                                <ArrowLeft className="h-5 w-5 text-zinc-200"/>
                                <span className="text-xs text-zinc-400">Back</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="flex-col items-center justify-center space-y-0.5"
                                onClick={handleRemove}
                            >
                                <TrashIcon className="h-5 w-5 text-zinc-200"/>
                                <span className="text-xs text-zinc-400">Trash</span>
                            </Button>
                        </motion.div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    )
}
