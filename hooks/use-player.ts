import { create } from "zustand";

interface UsePlayerProps {
    isPlaying : boolean;
    songId : string;
    albumId : string;
    setIsPlaying : ( value : boolean ) => void;
    setSongId : ( id: string ) => void;
    setAlbumId : ( id : string ) => void;
}

export const usePlayer = create<UsePlayerProps>((set)=>({
    isPlaying : false,
    songId : "",
    albumId : "",
    setIsPlaying : ( value : boolean ) => set({ isPlaying : value }),
    setSongId : ( id: string ) => set({ songId: id }),
    setAlbumId : ( id: string ) => set({ albumId: id })
}));