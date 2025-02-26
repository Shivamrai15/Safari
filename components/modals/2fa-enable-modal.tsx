"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { useTwoFactorModal } from "@/hooks/use-two-factor-modal";

export const TwoFactorEnableModal = () => {

    const { isOpen, onClose } = useTwoFactorModal();

    return (
        <Dialog open={isOpen} >
            <DialogContent className="max-w-sm w-full rounded-md p-4 bg-neutral-900 border">
                <DialogHeader className="space-y-3 mt-3">
                    <div className="flex items-center justify-center w-full">
                        <div className="relative size-16">
                            <Image
                                src="/assets/check.png"
                                fill
                                alt="Checkmark"
                            />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-lg">Two-factor authentication is on</DialogTitle>
                    <DialogDescription className="text-sm px-4 text-center text-zinc-300">
                        Two-factor authentication is enabled on your account. You&apos;ll need a verification code from your authenticator app when logging in.
                    </DialogDescription>
                </DialogHeader>
                <Button
                    variant="secondary"
                    size="sm"
                    className="font-semibold mt-4"
                    type="button"
                    onClick={onClose}
                >
                    Got it
                </Button>
            </DialogContent>
        </Dialog>
    )
}
