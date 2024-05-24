import { PersistStorage } from 'zustand/middleware';
import { decrypt, encrypt } from '@/lib/cryptography';
import { Album, Song } from "@prisma/client";


interface UseQueueProps {
    queue : (Song & { album : Album })[];
    stack : (Song & { album : Album })[];
    current : ( Song & { album : Album } ) | null;
    enQueue : (songs : ( Song & { album : Album } )[], clear?: boolean)=>void;
    deQueue : ()=>void;
    push : (song : ( Song & { album : Album } ))=>void;
    pop : ()=>void;
    priorityEnqueue : (songs : ( Song & { album : Album } )[])=>void;
    clear : ()=>void;
    shiftToTopOfQueue : (id : string)=>void;
    replace : ( id: string, source : number, destination : number )=>null|void;
    remove : ( id : string )=>null|void;
    shuffle : () => void;
}


export const  customQueueStorage: PersistStorage<UseQueueProps> =  {
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

