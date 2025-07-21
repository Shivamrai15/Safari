import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"

interface Props {
    visited : string[];
    setVisited: (visited: string[]) => void;
}

export const useShuffleList = create(persist<Props>((set, get)=>(
    {
        visited: [],
        setVisited: (visited: string[]) => {
            set({ visited: Array.from(new Set([...get().visited, ...visited])) });
        }
    }),{
        name: "list",
        storage: createJSONStorage(() => sessionStorage),
    }
))