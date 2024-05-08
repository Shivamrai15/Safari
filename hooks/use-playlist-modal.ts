import { create } from "zustand";

interface UsePlaylistModalProps {
    isOpen : boolean;
    loading : boolean;
    onOpen : () => void;
    onClose : () => void;
    setLoading : ( loading: boolean ) => void;
}

export const usePlaylistModal = create<UsePlaylistModalProps>((set)=>({
    isOpen : false,
    loading : false,
    onOpen : () => set({ isOpen : true }),
    onClose : () => set({ isOpen : false }),
    setLoading : ( loading: boolean ) => set({ loading })
}))