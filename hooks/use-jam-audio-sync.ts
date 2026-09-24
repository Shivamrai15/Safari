import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { jamExpectedPositionMs, jamServerNow, useJam } from "./use-jam";
import { useQueue } from "./use-queue";
import { sendJamCommand, syncJamClock } from "@/lib/jam";

const DRIFT_THRESHOLD_MS = 400;
const DRIFT_CHECK_MS = 5000;
const CLOCK_RESYNC_MS = 60 * 1000;
const LISTENER_TICK_MS = 500;
const SEEK_DEBOUNCE_MS = 250;
const HAVE_METADATA = 1;

export const useJamAudioSync = (audioRef: MutableRefObject<HTMLAudioElement | null>) => {
    const jam = useJam((state) => state.state);
    const userId = useJam((state) => state.userId);
    const currentSongId = useQueue((state) => state.current?.id);
    const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const seekTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [listenerPositionMs, setListenerPositionMs] = useState(0);
    const [loadedSongId, setLoadedSongId] = useState<string | null>(null);

    const isActive = !!jam;
    const isHost = !!jam && jam.hostId === userId;
    const isListener = !!jam && jam.settings.mode === "HOST_SPEAKER" && !isHost;
    const track = jam ? jam.queue[jam.currentIndex] : undefined;

    const clearStartTimer = () => {
        if (startTimer.current) {
            clearTimeout(startTimer.current);
            startTimer.current = null;
        }
    };

    const align = useCallback(() => {
        const audio = audioRef.current;
        const state = useJam.getState().state;
        const current = state?.queue[state.currentIndex];
        if (!audio || !state || !current) return;

        if (isListener) {
            clearStartTimer();
            if (!audio.paused) audio.pause();
            return;
        }

        if (audio.readyState < HAVE_METADATA || useQueue.getState().current?.id !== current.song.id) return;

        clearStartTimer();
        const targetSeconds = jamExpectedPositionMs(state) / 1000;
        const drifted = Math.abs(audio.currentTime - targetSeconds) * 1000 > DRIFT_THRESHOLD_MS;

        if (state.playback.status === "playing") {
            const waitMs = state.playback.updatedAt - jamServerNow();
            if (waitMs > 0) {
                if (!audio.paused) audio.pause();
                audio.currentTime = state.playback.positionMs / 1000;
                startTimer.current = setTimeout(() => {
                    audio.play().catch(() => undefined);
                }, waitMs);
                return;
            }
            if (drifted) audio.currentTime = targetSeconds;
            if (audio.paused) audio.play().catch(() => undefined);
            return;
        }

        if (!audio.paused) audio.pause();
        if (drifted) audio.currentTime = targetSeconds;
    }, [audioRef, isListener]);

    const onSourceReady = useCallback(() => {
        setLoadedSongId(useQueue.getState().current?.id ?? null);
        if (useJam.getState().state) {
            align();
        } else {
            audioRef.current?.play().catch(() => undefined);
        }
    }, [align, audioRef]);

    useEffect(() => {
        if (isActive) align();
    }, [isActive, jam?.version, currentSongId, loadedSongId, align]);

    useEffect(() => {
        if (!isActive || isListener || jam?.playback.status !== "playing") return;
        const interval = setInterval(align, DRIFT_CHECK_MS);
        return () => clearInterval(interval);
    }, [isActive, isListener, jam?.playback.status, align]);

    useEffect(() => {
        if (!isListener) return;
        const tick = () => {
            const state = useJam.getState().state;
            setListenerPositionMs(state ? jamExpectedPositionMs(state) : 0);
        };
        tick();
        const interval = setInterval(tick, LISTENER_TICK_MS);
        return () => clearInterval(interval);
    }, [isListener, jam?.version]);

    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(() => {
            syncJamClock().catch(() => undefined);
        }, CLOCK_RESYNC_MS);
        return () => clearInterval(interval);
    }, [isActive]);

    useEffect(() => {
        if (!isActive) clearStartTimer();
        return clearStartTimer;
    }, [isActive]);

    const togglePlayback = () => {
        const state = useJam.getState().state;
        if (!state) return;
        const positionMs = isListener
            ? jamExpectedPositionMs(state)
            : (audioRef.current?.currentTime ?? 0) * 1000;
        sendJamCommand(state.playback.status === "playing" ? { type: "PAUSE", positionMs } : { type: "PLAY", positionMs });
    };

    const seek = (seconds: number) => {
        if (seekTimer.current) clearTimeout(seekTimer.current);
        seekTimer.current = setTimeout(() => {
            sendJamCommand({ type: "SEEK", positionMs: seconds * 1000 });
        }, SEEK_DEBOUNCE_MS);
    };

    const trackEnded = () => {
        if (!track || isListener) return;
        if (jam?.settings.mode === "HOST_SPEAKER" && !isHost) return;
        sendJamCommand({ type: "TRACK_ENDED", itemId: track.itemId });
    };

    return {
        isActive,
        isListener,
        isPlaying: jam?.playback.status === "playing",
        listenerPositionSeconds: listenerPositionMs / 1000,
        onSourceReady,
        togglePlayback,
        seek,
        trackEnded,
    };
}
