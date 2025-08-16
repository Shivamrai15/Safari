import {
    Song as S,
    Album,
    PlaylistSong as PS,
    LikedSongs as LS
} from "@prisma/client";

export interface User {
    name : string;
    email : string;
    socketId : string;
    isHost : boolean;
    image : string|undefined
}


export type Artist = {
    id: string;
    name: string;
    image: string;
}


export type Song = S & {
    album : Album ,
    artists : Artist[]
}



export type PlaylistSong = PS & { song : Song };

export type LikedSong =  ( LS & { song: Song });


export type RoomUser = {
    name : string;
    email : string;
    socketId : string;
    isHost : boolean;
    image : string|undefined|null
}


export type HistoryItem = {
    id: string;
    songId: string;
    userId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    song: Song;
};


export type AccountResponse = {
    name: string | null;
    id: string;
    privateSession: boolean;
    isActive : boolean;
    showRecommendations: boolean;
}

export type Status = {
  status: "up" | "down";
  timestamp: number;
  response_time: number;
  message: string;
};

export type Service = {
  service: string;
  statuses: Status[];
};