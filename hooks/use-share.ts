"use client";

export const useShare = async ( url : string, type : "artist" | "album" | "song" | "playlist" ) => {
    if ( navigator ) {
        await navigator.share({
            title : `Check out this ${type} on Safari`,
            url : `${window.location.origin}${url}`
        });
    }
}