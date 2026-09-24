import { create } from 'zustand';
import { Album, Song } from '@prisma/client';
import { getJamQueueHandler } from '@/lib/jam-queue-bridge';

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
    playNext : (song : ( Song & { album : Album } ))=>void;
}

export const useQueue = create<UseQueueProps>((set, get)=>({

        queue : [],
        stack : [],
        current : null,
        enQueue : ( songs : ( Song & { album : Album } )[], clear?: boolean ) => {
            const jam = getJamQueueHandler();
            if ( jam ) return jam.enQueue(songs, clear);
            if (clear) {
                set({ queue: songs, stack : [], current : null  });
            } else {
                const currentQueue = get().queue;
                const uniqueSongs = songs.filter(song => !currentQueue.some(qSong => qSong.id === song.id));
                set({ queue : [...get().queue, ...uniqueSongs] })
            }
        },
        deQueue : () => {
            const jam = getJamQueueHandler();
            if ( jam ) return jam.deQueue();
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
            const jam = getJamQueueHandler();
            if ( jam ) return jam.pop();
            const stackList = [...get().stack];
            if ( stackList.length > 0 ) {
                const popedSong = stackList.pop();
                if ( popedSong ) {
                    set({ queue : [popedSong, ...get().queue], stack : stackList, current : popedSong });
                }
            }
        },
        priorityEnqueue : ( songs : ( Song & { album : Album } )[] ) => {
            const jam = getJamQueueHandler();
            if ( jam ) return jam.priorityEnqueue(songs);
            const currentQueue = get().queue;
            const uniqueSongs = songs.filter(song => !currentQueue.some(qSong => qSong.id === song.id));
            if ( songs.length === 1 && uniqueSongs.length === 0 ) {
                const queueList = [...get().queue];
                const index = queueList.findIndex((song)=>song.id === songs[0].id);
                if ( index !== -1 ) {
                    const currentSong = queueList[index];
                    queueList.splice(index, 1);
                    queueList.unshift(currentSong);
                    set({ queue : queueList, current : queueList[0] });
                }
            } else {
                set({ queue : [...uniqueSongs, ...get().queue]});
                if ( uniqueSongs[0] ) {
                    set({ current : uniqueSongs[0] });
                }
            }
        },
        clear : () => {
            if ( getJamQueueHandler() ) return;
            set({ queue: [], stack : [], current: null });
        },
        shiftToTopOfQueue : (id : string) => {
            const jam = getJamQueueHandler();
            if ( jam ) return jam.shiftToTopOfQueue(id);
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

            const jam = getJamQueueHandler();
            if ( jam ) return jam.reorderUpcoming(queueList.slice(1).map((song)=>song.id));
            set({queue : queueList});
        },
        remove : ( id : string ) => {
            const jam = getJamQueueHandler();
            if ( jam ) return jam.remove(id);
            const queueList = [...get().queue];
            const filteredQueue = queueList.filter((item)=>item.id!==id);
            set({ queue: filteredQueue })
        },
        shuffle : () => {
            const jam = getJamQueueHandler();
            if ( jam ) return jam.shuffle();
            const queueList = [...get().queue];
            if ( queueList.length > 2 ) {
                const currentItem = queueList.shift();
                for ( let i =0 ; i < queueList.length ; i++ ) {
                    const j = Math.floor(Math.random()*(i+1));
                    [queueList[i], queueList[j]] = [queueList[j], queueList[i]];
                }
                if ( currentItem ) {
                    set({ queue : [currentItem, ...queueList] })
                }
            }
        },
        playNext : ( song : ( Song & { album : Album } ) ) => {
            const jam = getJamQueueHandler();
            if ( jam ) return jam.playNext(song);
            const remainingSongs = get().queue.slice(1);
            const songs = [ get().queue[0], song, ...remainingSongs ];
            set({ queue : songs });
        }
    })
);
