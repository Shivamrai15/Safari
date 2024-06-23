"use client";

import { Button } from "@/components/ui/button";
import { useShareModal } from "@/hooks/use-share-modal";
import { PiShareFatFill } from "react-icons/pi";

interface ShareButtonProps {
    genreId : string;
}

export const ShareButton = ({
    genreId
} : ShareButtonProps ) => {

    const { onOpen } = useShareModal();

    return (
        <Button
            variant="ghost"
            size="icon"
            className="focus:outline-none hover:bg-transparent"
            onClick={()=>onOpen(`/browse/genre/${genreId}`)}
        >
            <PiShareFatFill className="h-8 w-8 md:h-10 md:w-10 text-white" />
        </Button>
    )
}