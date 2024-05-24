import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UseControlsProps {
    volume : number;
    repeat : boolean;
    mute : boolean;
    setVolume : ( volume : number ) => void;
    setRepeat : ( value : boolean ) => void;
    setMute : ( value : boolean ) => void;
}



export const useControls = create(persist<UseControlsProps>((set)=>({
        volume : 1,
        repeat : false,
        mute : false,
        setVolume : ( volume : number ) => set({volume}),
        setRepeat : ( value: boolean ) => set({ repeat : value }),
        setMute : ( value: boolean ) => set({mute: value})
    }),
    {
        name : "safari-controls",
        storage : createJSONStorage(()=>localStorage),
    }
))