import { Album, Song } from "@prisma/client";

export type JamMode = "EVERYONE_PLAYS" | "HOST_SPEAKER";

export type JamSettings = {
    mode: JamMode;
    guestsCanControlPlayback: boolean;
    guestsCanAddSongs: boolean;
    guestsCanReorderAndRemove: boolean;
    joinApproval: "OPEN" | "HOST_APPROVES";
    maxMembers: number;
    endWhenHostLeaves: boolean;
};

export type JamSong = Song & { album: Album };

export type JamTrack = {
    itemId: string;
    song: JamSong;
    addedBy: string;
};

export type JamMember = {
    userId: string;
    name: string;
    image: string | null;
    joinedAt: number;
};

export type JamState = {
    id: string;
    code: string;
    hostId: string;
    createdAt: number;
    version: number;
    settings: JamSettings;
    members: JamMember[];
    pending: JamMember[];
    queue: JamTrack[];
    currentIndex: number;
    playback: {
        status: "playing" | "paused";
        positionMs: number;
        updatedAt: number;
    };
};

export type JamResponse =
    | { ok: true; state: JamState | null }
    | { ok: false; error: string; pending?: boolean };

export type JamCommand =
    | { type: "PLAY"; positionMs?: number }
    | { type: "PAUSE"; positionMs?: number }
    | { type: "SEEK"; positionMs: number }
    | { type: "NEXT" }
    | { type: "PREV" }
    | { type: "TRACK_ENDED"; itemId: string }
    | { type: "ADD"; songIds: string[]; next?: boolean }
    | { type: "PLAY_SONGS"; songIds: string[] }
    | { type: "REPLACE_QUEUE"; songIds: string[] }
    | { type: "JUMP"; itemId: string }
    | { type: "REMOVE"; itemId: string }
    | { type: "MOVE"; itemIds: string[] }
    | { type: "SHUFFLE" }
    | { type: "UPDATE_SETTINGS"; settings: Partial<JamSettings> }
    | { type: "KICK"; userId: string }
    | { type: "TRANSFER_HOST"; userId: string };
