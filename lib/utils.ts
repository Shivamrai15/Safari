import { Album, Artist, Song } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

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
        return num;
    } else if ( num <1000000 ) {
        return `${(num/1000).toFixed(2)}K`
    } else if ( num < 1000000000 ) {
        return `${(num/1000000).toFixed(2)}M`
    } else {
        return `${(num/1000000000).toFixed(2)}B`
    }
}


export const differnceBtwHistory = ( h1 : Date, h2 : Date ) => {
    try {
        const hist1 = new Date(h1);
        const hist2 = new Date(h2);
    
        if ( hist1.getDate() === hist2.getDate() && hist1.getMonth() === hist2.getMonth() && hist1.getFullYear() === hist2.getFullYear() ) {
            return null;
        } 
    
        if ( hist1.getDate()-hist2.getDate() > 0 &&  hist1.getMonth() === hist2.getMonth()  &&  hist1.getFullYear() === hist2.getFullYear() ){
            
            if ( new Date().getDate() === (hist2.getDate() + 1) ) {
                return "Yesterday";
            }
            if ( (new Date().getDate()-hist2.getDate()) < 6 ) {
                return format(hist2, "eeee");
            }
        }
    
        if ( hist1.getFullYear() === hist2.getFullYear() ) {
            return format(hist2, "dd MMMM");
        }
    
        return format(hist2, "dd MMMM yyyy");
    } catch (error) {
        return null;
    }
}

export const historyPartition = ( 
    pages : any[], 
    i : number, 
    group : ( Song & {
        artists : Artist[],
        album : Album ,
        history : Date
    })[],
    idx : number
) => {

    try {
        if ( i === 0 && idx < group.length-1 ) {
            const h1 = group[idx].history;
            const h2 = group[idx+1].history;
            const diff  = differnceBtwHistory(h1, h2);
            return diff;
        }
    
        if ( pages.length > 1 && idx === group.length-1 && i < pages.length-1 ) {
            const h1 = group[idx].history;
            const h2 = pages[i+1]['items'][0]['history'];
            const diff  = differnceBtwHistory(h1, h2);
            return diff;
        }
    
        if ( idx < group.length-1 ) {
            const h1 = group[idx].history;
            const h2 = group[idx+1].history;
            const diff  = differnceBtwHistory(h1, h2);
            return diff;
        }
    
        return null;
    } catch (error) {
        return null;
    }
}


export const getSubArrays = ( data : (Song & { album : Album, artists : Artist[] })[] ) => {
    let subarrays = [];
    for (let i = 0; i < data.length; i += 4) {
        subarrays.push(data.slice(i, i + 4));
    }
    return subarrays;
} 