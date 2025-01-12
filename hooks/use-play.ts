import { set } from "zod";
import { create } from "zustand";

interface UsePlayProps { 
    play : boolean;
    setPlay : (play: boolean)=>void;
}

export const usePlay = create<UsePlayProps>((set)=>({
    play : false,
    setPlay : (play: boolean)=>set({ play: play})
}));