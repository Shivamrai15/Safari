"use client";

import { Button } from "@/components/ui/button";
import { PiShareFatFill } from "react-icons/pi";

interface ShareButtonProps {
    genreId : string;
}

export const ShareButton = ({
    genreId
} : ShareButtonProps ) => {

    const share = async ( url: string , type : "song"|"album"|"artist"|"playlist" ) => {
        if ( navigator ) {
            await navigator.share({
                title : `Check out this ${type} on Safari`,
                url : `${window.location.origin}${url}`
            });
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="focus:outline-none hover:bg-transparent"
            onClick={(e)=>{e.stopPropagation(); share(`/browse/genre/${genreId}`, "playlist"); }}
        >
            <PiShareFatFill className="h-8 w-8 md:h-10 md:w-10 text-white" />
        </Button>
    )
}