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


export type Song = S & {
    album : Album ,
    artists : {
        id : string,
        name : string,
        image: string}[]
}



export type PlaylistSong = PS & { song : Song };

export type LikedSong =  ( LS & { song: Song });