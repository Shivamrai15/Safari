import { create } from "zustand";

interface UseTwoFactorModalProps {
    isOpen : boolean;
    onOpen : ()=>void;
    onClose : ()=>void;
}

export const useTwoFactorModal = create<UseTwoFactorModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
