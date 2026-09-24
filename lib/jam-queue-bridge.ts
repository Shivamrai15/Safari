import { JamSong } from "./jam-types";

export interface JamQueueHandler {
    enQueue: (songs: JamSong[], clear?: boolean) => void;
    priorityEnqueue: (songs: JamSong[]) => void;
    deQueue: () => void;
    pop: () => void;
    playNext: (song: JamSong) => void;
    shuffle: () => void;
    remove: (songId: string) => void;
    shiftToTopOfQueue: (songId: string) => void;
    reorderUpcoming: (songIds: string[]) => void;
}

let handler: JamQueueHandler | null = null;

export const setJamQueueHandler = (next: JamQueueHandler | null) => {
    handler = next;
}

export const getJamQueueHandler = () => handler;
