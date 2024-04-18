import { create } from "zustand";
import { Album, Artist, Song } from "@prisma/client";

interface UsePlayerQueueProps {
    songs : (Song & { artists : Artist[], album : Album })[];
    activeId : string|undefined;
    setId : ( id: string ) => void;
    addInQueue : ( songs: (Song & { artists : Artist[], album : Album })[] ) => void;
    reset : () => void;
}

export const usePlayerQueue = create<UsePlayerQueueProps>((set, get)=>({
    songs : [],
    activeId : undefined,
    setId : ( id : string ) => set({ activeId : id }),
    addInQueue : ( song : (Song & { artists : Artist[], album : Album })[] ) => set({songs : [...song ,...get().songs]}),
    reset : () => set({
        songs : [],
        activeId : undefined
    })
}))

