import { create } from "zustand";

interface ShareModalProps {
    isOpen: boolean;
    url : string;
    onClose: () => void;
    onOpen : ( url: string ) =>  void;
}

export const useShareModal = create<ShareModalProps>((set)=>({
    isOpen: false,
    url : "",
    onOpen : (url : string) => set({ isOpen : true, url }),
    onClose : () => set({ isOpen : false, url : "" })
}));