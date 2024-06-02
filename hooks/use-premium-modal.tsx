import { create } from "zustand";

interface UsePremiumModalProps{
    isPremiumModalOpen : boolean;
    onOpenPremiumModal : ()=>void;
    onClosePremiumModal : ()=>void;
}

export const usePremiumModal = create<UsePremiumModalProps>((set)=>({
    isPremiumModalOpen : false,
    onOpenPremiumModal : ()=>set({isPremiumModalOpen : true}),
    onClosePremiumModal : ()=>set({isPremiumModalOpen : false})
}));