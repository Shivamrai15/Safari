import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const songLength = (len: number) => {
    const min = Math.floor(len/60);
    const sec = len%60;
    return `${min}:${sec<10 ? "0" : ""}${sec}`;
}

export const albumLength = ( len: number ) => {
    const min = Math.floor(len/60);
    const sec = len%60;
    return `${min} min ${sec<10 ? "0" : ""}${sec} sec`;
}

export const subscriber = ( num : number ) => {
    if (num < 1000 ) {
        return "0";
    } else if ( num <1000000 ) {
        return `${(num/1000).toFixed(2)}K`
    } else if ( num < 1000000000 ) {
        return `${(num/1000000).toFixed(2)}M`
    } else {
        return `${(num/1000000000).toFixed(2)}B`
    }
}