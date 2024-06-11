import { customAdsStorage } from "@/lib/custom-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UseAdsProps {
    prevAdTimeStamp : undefined | number,
    setPrevAdTimeStamp : () => void; 
}

export const useAds = create(persist<UseAdsProps>((set)=>({
        prevAdTimeStamp: undefined,
        setPrevAdTimeStamp:()=>set({ prevAdTimeStamp : Date.now() })
    }),
    {
        name: "af0f2fbc667b5174f58240e6",
        storage : customAdsStorage
    }
))