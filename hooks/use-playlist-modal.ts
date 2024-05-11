import { create } from "zustand";

type playlist  = {
    id : string;
    name : string;
    description : string | undefined;
    private : boolean;
}

interface UsePlaylistModalProps {
    data : playlist | undefined ;
    isOpen : boolean;
    loading : boolean;
    onOpen : () => void;
    onClose : () => void;
    setLoading : ( loading: boolean ) => void;
    setData : ( value : playlist | undefined ) => void;
}

export const usePlaylistModal = create<UsePlaylistModalProps>((set)=>({
    data : undefined,
    isOpen : false,
    loading : false,
    onOpen : () => set({ isOpen : true }),
    onClose : () => set({ isOpen : false }),
    setLoading : ( loading: boolean ) => set({ loading }),
    setData : ( value : playlist | undefined ) => set({ data : value })
}));