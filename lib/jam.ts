import { toast } from "sonner";
import { useJam } from "@/hooks/use-jam";
import { useQueue } from "@/hooks/use-queue";
import { JamCommand, JamMode, JamResponse, JamState } from "./jam-types";
import { JamQueueHandler, setJamQueueHandler } from "./jam-queue-bridge";
import { onSocketConnect, requestSocket, socketInstance } from "./socket";

const CLOCK_SAMPLES = 5;
const MAX_SEED_SONGS = 50;

let listenersInstalled = false;
let profile = { name: "Listener", image: null as string | null };

export const setJamProfile = (next: { name?: string | null; image?: string | null }) => {
    profile = { name: next.name || "Listener", image: next.image ?? null };
}

const errorMessage = (error: unknown) =>
    error instanceof Error && error.message ? error.message : "Something went wrong, please try again";

const isMember = (state: JamState) => state.members.some((member) => member.userId === useJam.getState().userId);

const upcomingTracks = () => {
    const state = useJam.getState().state;
    return state ? state.queue.slice(state.currentIndex + 1) : [];
}

const mirrorQueue = (state: JamState | null) => {
    if (!state) return;
    const songs = state.queue.map((track) => track.song);
    const index = state.currentIndex;
    const next = index >= 0 ? songs[index] ?? null : null;
    const previous = useQueue.getState().current;
    useQueue.setState({
        current: next && previous?.id === next.id ? previous : next,
        queue: index >= 0 ? songs.slice(index) : [],
        stack: index > 0 ? songs.slice(0, index) : [],
    });
}

const queueHandler: JamQueueHandler = {
    enQueue: (songs, clear) => {
        sendJamCommand({ type: clear ? "REPLACE_QUEUE" : "ADD", songIds: songs.map((song) => song.id) });
    },
    priorityEnqueue: (songs) => {
        sendJamCommand({ type: "PLAY_SONGS", songIds: songs.map((song) => song.id) });
    },
    deQueue: () => {
        sendJamCommand({ type: "NEXT" });
    },
    pop: () => {
        sendJamCommand({ type: "PREV" });
    },
    playNext: (song) => {
        sendJamCommand({ type: "ADD", songIds: [song.id], next: true });
    },
    shuffle: () => {
        sendJamCommand({ type: "SHUFFLE" });
    },
    remove: (songId) => {
        const track = upcomingTracks().find((item) => item.song.id === songId);
        if (track) sendJamCommand({ type: "REMOVE", itemId: track.itemId });
    },
    shiftToTopOfQueue: (songId) => {
        const track = upcomingTracks().find((item) => item.song.id === songId);
        if (track) sendJamCommand({ type: "JUMP", itemId: track.itemId });
    },
    reorderUpcoming: (songIds) => {
        const tracks = upcomingTracks();
        const itemIds = songIds
            .map((songId) => tracks.find((track) => track.song.id === songId)?.itemId)
            .filter((itemId): itemId is string => !!itemId);
        if (itemIds.length === tracks.length) sendJamCommand({ type: "MOVE", itemIds });
    },
}

export const applyJamState = (state: JamState | null) => {
    useJam.getState().setJamState(state);
    const applied = useJam.getState().state;
    setJamQueueHandler(applied ? queueHandler : null);
    mirrorQueue(applied);
}

export async function syncJamClock() {
    let best: { rtt: number; offset: number } | null = null;
    for (let i = 0; i < CLOCK_SAMPLES; i++) {
        const sentAt = Date.now();
        const { serverTime } = await requestSocket<{ serverTime: number }>("jam:ping");
        const receivedAt = Date.now();
        const rtt = receivedAt - sentAt;
        const offset = serverTime - (sentAt + rtt / 2);
        if (!best || rtt < best.rtt) best = { rtt, offset };
    }
    if (best) useJam.getState().setClockOffset(best.offset);
}

export async function sendJamCommand(command: JamCommand): Promise<boolean> {
    try {
        const response = await requestSocket<JamResponse>("jam:command", command as Record<string, unknown>);
        if (!response.ok) {
            toast.error(response.error);
            return false;
        }
        if (response.state) applyJamState(response.state);
        return true;
    } catch (error) {
        toast.error(errorMessage(error));
        return false;
    }
}

async function handleMembershipResponse(response: JamResponse, code?: string): Promise<boolean> {
    if (response.ok) {
        applyJamState(response.state);
        syncJamClock().catch(() => undefined);
        return true;
    }
    if (response.pending && code) {
        useJam.getState().setPendingCode(code);
        return false;
    }
    toast.error(response.error);
    return false;
}

export async function startJam(mode: JamMode): Promise<boolean> {
    const { current, queue } = useQueue.getState();
    const seed = [current, ...queue.slice(1)]
        .filter((song): song is NonNullable<typeof song> => !!song)
        .slice(0, MAX_SEED_SONGS)
        .map((song) => song.id);

    try {
        const response = await requestSocket<JamResponse>("jam:create", { mode, profile });
        const started = await handleMembershipResponse(response);
        if (started && seed.length > 0) {
            await sendJamCommand({ type: "REPLACE_QUEUE", songIds: seed });
        }
        return started;
    } catch (error) {
        toast.error(errorMessage(error));
        return false;
    }
}

export async function joinJam(code: string): Promise<boolean> {
    try {
        const response = await requestSocket<JamResponse>("jam:join", { code, profile });
        return handleMembershipResponse(response, code);
    } catch (error) {
        toast.error(errorMessage(error));
        return false;
    }
}

export async function leaveJam() {
    applyJamState(null);
    useJam.getState().setPendingCode(null);
    try {
        await requestSocket<JamResponse>("jam:leave");
    } catch (error) {
        console.warn("[Jam] Leave failed:", error);
    }
}

export async function endJam() {
    try {
        const response = await requestSocket<JamResponse>("jam:end");
        if (!response.ok) {
            toast.error(response.error);
            return;
        }
        applyJamState(null);
    } catch (error) {
        toast.error(errorMessage(error));
    }
}

export async function respondToJoinRequest(userId: string, approve: boolean) {
    useJam.getState().removeJoinRequest(userId);
    try {
        const response = await requestSocket<JamResponse>("jam:respond", { userId, approve });
        if (!response.ok) toast.error(response.error);
        else if (response.state) applyJamState(response.state);
    } catch (error) {
        toast.error(errorMessage(error));
    }
}

export async function resyncJam() {
    try {
        const response = await requestSocket<JamResponse>("jam:sync");
        if (!response.ok) return;
        const wasInJam = !!useJam.getState().state;
        applyJamState(response.state);
        if (response.state) {
            syncJamClock().catch(() => undefined);
        } else if (wasInJam) {
            toast.info("The Jam has ended");
        }
    } catch (error) {
        console.warn("[Jam] Sync failed:", error);
    }
}

export function installJamListeners() {
    if (listenersInstalled) return;
    listenersInstalled = true;

    const socket = socketInstance();

    socket.on("jam:state", (state: JamState) => {
        if (state && isMember(state)) {
            applyJamState(state);
        }
    });

    socket.on("jam:ended", (payload: { jamId?: string; reason?: string }) => {
        const current = useJam.getState().state;
        if (!current || (payload?.jamId && payload.jamId !== current.id)) return;
        applyJamState(null);
        toast.info(payload?.reason ?? "The Jam has ended");
    });

    socket.on("jam:join-request", (payload: { userId?: string; name?: string }) => {
        if (payload?.userId) {
            useJam.getState().addJoinRequest({ userId: payload.userId, name: payload.name ?? "Someone" });
            toast.info(`${payload.name ?? "Someone"} wants to join your Jam`);
        }
    });

    socket.on("jam:rejected", () => {
        useJam.getState().setPendingCode(null);
        toast.error("The host didn't let you into the Jam");
    });

    onSocketConnect(() => {
        resyncJam();
    });
}
