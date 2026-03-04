import axios from "axios";

export interface HistoryEntry {
    userId: string;
    trackId: string;
    songDuration: number;
    playedDuration: number;
    playedAt: Date;
}

export const sendHistory = async (entries: HistoryEntry[]) => {
    try {
        if (entries.length === 0) return;
        await axios.post("/api/v1/song/history", entries);
    } catch (error) {
        console.error("[HistoryService] Failed to send history", error);
    }
};
