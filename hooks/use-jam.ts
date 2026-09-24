import { create } from "zustand";
import { JamState } from "@/lib/jam-types";

export interface JamJoinRequest {
    userId: string;
    name: string;
}

interface JamStore {
    state: JamState | null;
    userId: string | null;
    clockOffsetMs: number;
    pendingCode: string | null;
    joinRequests: JamJoinRequest[];
    setJamState: (state: JamState | null) => void;
    setUserId: (userId: string | null) => void;
    setClockOffset: (offsetMs: number) => void;
    setPendingCode: (code: string | null) => void;
    addJoinRequest: (request: JamJoinRequest) => void;
    removeJoinRequest: (userId: string) => void;
}

export const useJam = create<JamStore>((set, get) => ({
    state: null,
    userId: null,
    clockOffsetMs: 0,
    pendingCode: null,
    joinRequests: [],
    setJamState: (state) => {
        const current = get().state;
        if (state && current && state.id === current.id && state.version < current.version) return;
        set({
            state,
            pendingCode: state ? null : get().pendingCode,
            joinRequests: state
                ? get().joinRequests.filter((request) => state.pending.some((member) => member.userId === request.userId))
                : [],
        });
    },
    setUserId: (userId) => set({ userId }),
    setClockOffset: (clockOffsetMs) => set({ clockOffsetMs }),
    setPendingCode: (pendingCode) => set({ pendingCode }),
    addJoinRequest: (request) => set({
        joinRequests: [...get().joinRequests.filter((item) => item.userId !== request.userId), request],
    }),
    removeJoinRequest: (userId) => set({
        joinRequests: get().joinRequests.filter((item) => item.userId !== userId),
    }),
}));

export const jamServerNow = () => Date.now() + useJam.getState().clockOffsetMs;

export const jamExpectedPositionMs = (state: JamState, now = jamServerNow()) => {
    const track = state.queue[state.currentIndex];
    if (!track) return 0;
    const { status, positionMs, updatedAt } = state.playback;
    const elapsed = status === "playing" ? Math.max(0, now - updatedAt) : 0;
    return Math.min(positionMs + elapsed, track.song.duration * 1000);
}
