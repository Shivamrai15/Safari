import { create } from "zustand";

interface UseSheetProps {
    isOpen : boolean
    onOpen : () => void;
    onClose : () => void;
}

export const useSheet = create<UseSheetProps>((set)=>({
    isOpen : false,
    onOpen : ()=>set({ isOpen : true }),
    onClose : ()=>set({ isOpen: false })
}));