"use client";

import { useEffect, useState } from "react";

export const useDebounce = (value : string, delay : number) => {

    const [ debounceValue, setDebounceValue ] = useState(value);

    useEffect(()=>{

        const timer = setTimeout(()=>{
            setDebounceValue(value);
        }, delay);

        return ()=>clearTimeout(timer);
    }, [value, delay]);

    return debounceValue;

}