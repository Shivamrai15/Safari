import { Album, Song } from "@prisma/client";
import { create } from "zustand";

interface MoodStackProps {
    uuid: string;
    data : ( Song & { album : Album } )[];
    setData : (data : ( Song & { album : Album } )[])=>void;
    clearData : () => void;
    setUuid : ( id : string ) => void;
    clearUuid : () => void;
}

export const useMoodStack = create<MoodStackProps>((set) => ({
    uuid: "",
    data: [],
    setData: (data: ( Song & { album : Album } )[]) => set({ data }),
    clearData: () => set({ data: [] }),
    setUuid: (id: string) => set({ uuid: id }),
    clearUuid: () => set({ uuid: "" })
}));

