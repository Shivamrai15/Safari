"use client";

import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";
import { useShareModal } from "@/hooks/use-share-modal";
import { Button } from "@/components/ui/button";
import { CheckCheck, Copy } from "lucide-react";
import {
    FaXTwitter,
    FaWhatsapp,
    FaInstagram,
    FaFacebook,
    FaLinkedin
} from "react-icons/fa6";
import { useState } from "react";

type Social = "Whatsapp" | "Twitter" | "Instagram" | "Facebook" | "Linkedin"

export const ShareModal = () => {

    const { isOpen, url, onClose } = useShareModal();
    const [ copyLink, setCopyLink ] = useState(false);

    const handleOnClose = ( open : boolean ) => {
        if(!open ) {
            onClose();
        }
    }

    const handleShareLink = () => {
        const href = `${window.location.origin}${url}`;
        setCopyLink(true);
        navigator.clipboard.writeText(href);
        setTimeout(()=>{
            setCopyLink(false);
        }, 1500);
    }

    const handleSocialShare = ( social : Social ) => {
        const href = `${window.location.origin}${url}`;
        switch (social) {
            case "Whatsapp":
                window.open(`https://api.whatsapp.com/send/?text=${href}`, "_blank");
                break;
            case "Twitter":
                window.open(`https://twitter.com/intent/post?url=${href}`, "_blank");
                break;
            case "Instagram":
                window.open(`https://www.instagram.com/?url=${href}`, "_blank");
                break;
            case "Facebook":
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${href}`, "_blank");
                break;
            case "Linkedin":
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${href}`, "_blank");
                break;
        }
    }

    return (
        <Dialog open = {isOpen} onOpenChange={handleOnClose} >
            <DialogContent className="bg-neutral-800 max-w-96 w-full rounded-lg">
                <div className="w-full space-y-4 my-4">
                    <h2 className="text-lg font-semibold">Share</h2>
                    <div className="w-full flex items-center">
                        <input disabled value={`${window.location.origin}${url}`} className="h-10 w-full px-2 border border-zinc-600 rounded-l-md truncate text-sm text-zinc-300" />
                        <Button 
                            className="h-10 w-16 rounded-l-none cursor-default md:cursor-pointer bg-neutral-900/80 text-white hover:bg-neutral-900/90 focus:outline-none"
                            onClick={handleShareLink}
                        >
                            { copyLink ? <CheckCheck className="h-5 w-5"/> : <Copy className="h-5 w-5"/> }
                        </Button>
                    </div>
                    <div className="w-full grid grid-cols-5 pt-4">
                        <Button
                            variant="secondary"
                            className="hover:bg-neutral-900/80"
                            onClick={()=>handleSocialShare("Whatsapp")}
                        >
                            <FaWhatsapp className="h-8 w-8 text-[#25D366]" />
                        </Button>
                        <Button
                            variant="secondary"
                            className="hover:bg-neutral-900/80"
                            onClick={()=>handleSocialShare("Instagram")}
                        >
                            <FaInstagram className="h-8 w-8 text-[#E1306C]" />
                        </Button>
                        <Button
                            variant="secondary"
                            className="hover:bg-neutral-900/80"
                            onClick={()=>handleSocialShare("Facebook")}
                        >
                            <FaFacebook className="h-8 w-8 text-[#1877F2]" />
                        </Button>
                        <Button
                            variant="secondary"
                            className="hover:bg-neutral-900/80"
                            onClick={()=>handleSocialShare("Twitter")}
                        >
                            <FaXTwitter className="h-8 w-8" />
                        </Button>
                        <Button
                            variant="secondary"
                            className="hover:bg-neutral-900/80"
                            onClick={()=>handleSocialShare("Linkedin")}
                        >
                            <FaLinkedin className="h-8 w-8 text-[#0077B5]" />
                        </Button> 
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}