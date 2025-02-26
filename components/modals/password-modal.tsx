"use client";

import { Dispatch, SetStateAction } from "react";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { on } from "events";


interface PasswordModalProps {
    onConfirm : ()=>void;
    disabled : boolean;
    password : string;
    setPassword : Dispatch<SetStateAction<string>>;
    open : boolean;
    setOpen : Dispatch<SetStateAction<boolean>>;
}

export const PasswordModal = ({
    open,
    setOpen,
    onConfirm,
    password,
    setPassword,
    disabled
}: PasswordModalProps) => {


    const onOpenChange = (isOpen: boolean)=>{
        if (disabled) return;
        if (!isOpen) {
            setOpen(false);
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="max-w-80 w-full bg-neutral-900 border p-4">
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-zinc-100 select-none">Enter password to confirm</p>
                    <Input
                        type="password"
                        className="bg-transparent h-8 border-zinc-600 outline-none focus-visible:ring-0 focus-visible:ring-offset-0  transition-all"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        placeholder="Password"
                        disabled={disabled}
                    />
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    className="h-8"
                    onClick={onConfirm}
                    disabled={disabled}
                >
                    Confirm
                </Button>
            </DialogContent>
        </Dialog>
    )
}
