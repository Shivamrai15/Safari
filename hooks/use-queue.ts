import { create } from 'zustand';
import { Album, Song } from '@prisma/client';
import { persist, createJSONStorage } from "zustand/middleware";

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
}

export const useQueue = create(persist<UseQueueProps>((set, get)=>({
   
    queue : [],
    stack : [],
    current : null,
    enQueue : ( songs : ( Song & { album : Album } )[], clear?: boolean ) => {
        if (clear) {
            set({ queue: songs, stack : [], current : null  });
        } else {
            const currentQueue = get().queue;
            const uniqueSongs = songs.filter(song => !currentQueue.some(qSong => qSong.id === song.id));
            set({ queue : [...get().queue, ...uniqueSongs] })
        }
    },
    deQueue : () => {
        const queueList = [...get().queue];
        if ( queueList.length > 0 ) {
            const deQueuedSong = queueList.shift();
            if ( deQueuedSong ) {
                set({ stack : [...get().stack, deQueuedSong], queue : queueList, current : queueList[0] });
            }
        }
    },
    push : ( song : ( Song & { album : Album } ) ) => set({ stack : [...get().stack, song] }),
    pop : () => {
        const stackList = [...get().stack];
        if ( stackList.length > 0 ) {
            const popedSong = stackList.pop();
            if ( popedSong ) {
                set({ queue : [popedSong, ...get().queue], stack : stackList, current : popedSong });
            }
        }
    },
    priorityEnqueue : ( songs : ( Song & { album : Album } )[] ) => {
        const currentQueue = get().queue;
        const uniqueSongs = songs.filter(song => !currentQueue.some(qSong => qSong.id === song.id));
        set({ queue : [...uniqueSongs, ...get().queue], current : uniqueSongs[0] });
    },
    clear : () => set({ queue: [], stack : [], current: null }),
    shiftToTopOfQueue : (id : string) => {
        const queueList = [...get().queue];
        const index = queueList.findIndex((song)=>song.id === id);
        if ( index !== -1 ) {
            const currentSong = queueList[index];
            queueList.splice(index, 1);
            queueList.unshift(currentSong);
            set({ queue : queueList, current : queueList[0] });
        }
    },
    replace : (id : string, source : number, destination : number) => {
        const queueList = [...get().queue];
        const songToMove = queueList.find((song)=>song.id===id);

        if (!songToMove) {
            return;
        }

        queueList.splice(source, 1);
        queueList.splice(destination, 0, songToMove);
        set({queue : queueList});
    },
    remove : ( id : string ) => {
        const queueList = [...get().queue];
        const filteredQueue = queueList.filter((item)=>item.id!==id);
        set({ queue: filteredQueue });
    }
    
}), {
    name : "queue",
    storage : createJSONStorage(()=>localStorage)
}));