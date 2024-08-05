import { PersistStorage } from 'zustand/middleware';
import { decrypt, encrypt } from '@/lib/cryptography';


interface UseAdsProps {
    prevAdTimeStamp : undefined | number;
    setPrevAdTimeStamp : () => void; 
    isAdPlaying : boolean;
    setIsAdPlaying : ( value: boolean ) => void;
}


export const  customAdsStorage: PersistStorage<UseAdsProps> =  {
    getItem: (name) => {
        const item = localStorage.getItem(name);
        return item ? JSON.parse(decrypt(item)) : null;
    },
    setItem: (name, value) => {
        localStorage.setItem(name, encrypt(JSON.stringify(value)));
    },
    removeItem: (name) => {
        localStorage.removeItem(name);
    },
};

