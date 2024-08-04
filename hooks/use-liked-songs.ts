import { create } from "zustand";

interface UseLikedSongsProps {
    songIds : string[];
    setSongIds : (ids: string[])=>void;
    addSongId : (id: string)=>void;
    removeSongId : (id: string)=>void;
}


export const useLikedSongs = create<UseLikedSongsProps>((set, get)=>({
    songIds : [],
    setSongIds : (ids: string[])=>set({songIds:ids}),
    addSongId : (id: string)=>{
        const updatedSongIds = [...(get().songIds), id]
        set({songIds: updatedSongIds})
    },
    removeSongId : (id: string)=>{
        const ids = get().songIds.filter((songId)=>songId!==id);
        set({ songIds: ids });
    }
}));