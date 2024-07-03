"use server";
import {dataset} from "./dataset.mjs";

import { db } from "@/lib/db";
import Fuse from "fuse.js";

const fuseOptions = {
    keys : ['name'],
    threshold : 0.4
}

export const getTopSearches =  async( query: string ) => {
    try {

        const fuse = new Fuse(dataset, fuseOptions);
        const similarity =  fuse.search(query);

        if ( similarity.length === 0 ) {
            return null;
        }

        const songIds = similarity.filter((res)=>res.item.type==="SONG").map((res)=>res.item.id).slice(0,5); 
        const albumIds = similarity.filter((res)=>res.item.type==="ALBUM").map((res)=>res.item.id).slice(0,5); 
        const artistIds = similarity.filter((res)=>res.item.type==="ARTIST").map((res)=>res.item.id).slice(0,5);


        const [ albums, artists, songs ] = await db.$transaction([
            db.album.findMany({
                where : {
                    id : {
                        in : albumIds
                    }
                }
            }),
            db.artist.findMany({
                where : {
                    id : {
                        in  : artistIds
                    }
                },
                select : {
                    id : true,
                    name : true,
                    image : true
                }
            }),
            db.song.findMany({
                where : {
                    id  : {
                        in : songIds
                    }
                },
                include : {
                    album : true,
                    artists : {
                        select : {
                            id : true,
                            image : true,
                            name : true
                        }
                    }
                }
            }),
        ]);

        songs.sort((a, b)=>songIds.indexOf(a.id)-songIds.indexOf(b.id));
        albums.sort((a, b)=>albumIds.indexOf(a.id)-albumIds.indexOf(b.id));
        artists.sort((a, b)=>artistIds.indexOf(a.id)-artistIds.indexOf(b.id));

        const topResult = similarity[0].item.type === "SONG" ? songs.shift() : similarity[0].item.type === "ALBUM" ? albums.shift() : artists.shift()
        
        return { topResult, songs, albums, artists }
        
    } catch (error) {
        console.error("TOP SEARCH API ERROR", error);
        return null;
    }
}

export const getAlbumSearches = async( query: string ) => {
    try {

        const fuse = new Fuse(dataset, fuseOptions);
        const similarity = fuse.search(query);

        if ( similarity.length === 0 ){
            return null;
        }

        const albumIds = similarity.filter((res)=>res.item.type==="ALBUM").map((res)=>res.item.id).slice(0,15);
        
        const albums = await db.album.findMany({
            where : {
                id : {
                    in : albumIds
                }
            }
        });

        albums.sort((a, b)=>albumIds.indexOf(a.id)-albumIds.indexOf(b.id));

        return albums;

    } catch (error) {
        console.error("ALBUM SEARCH API ERROR", error);
        return null;
    }
}

export const getSongSearches = async( query: string ) => {
    try {
        
        const fuse = new Fuse(dataset, fuseOptions);
        const similarity = fuse.search(query);

        if ( similarity.length === 0 ){
            return null;
        }

        const songIds = similarity.filter((res)=>res.item.type==="SONG").map((res)=>res.item.id).slice(0,15);

        const songs = await db.song.findMany({
            where : {
                id : {
                    in : songIds
                }
            },
            include : {
                album : true,
                artists : {
                    select : {
                        id : true,
                        name : true,
                        image : true
                    }
                }
            }
        });

        songs.sort((a, b)=>songIds.indexOf(a.id)-songIds.indexOf(b.id));
        return songs;

    } catch (error) {
        console.error("SONGS SEARCH API ERROR", error);
        return null;
    }
}

export const getArtistSearches = async( query: string ) => {
    try {
        
        const fuse = new Fuse(dataset, fuseOptions);
        const similarity = fuse.search(query);

        if ( similarity.length === 0 ){
            return null;
        }

        const artistIds = similarity.filter((res)=>res.item.type==="ARTIST").map((res)=>res.item.id).slice(0,15);

        const artists = await db.artist.findMany({
            where : {
                id : {
                    in : artistIds
                }
            },
            select : {
                id : true,
                name : true,
                image : true
            }
        });

        artists.sort((a, b)=>artistIds.indexOf(a.id)-artistIds.indexOf(b.id));
        return artists;

    } catch (error) {
        console.error("SONGS SEARCH API ERROR", error);
        return null;
    }
}


export const getPlaylistSearches = async ( query : string ) => {
    try {
        
        const playlists = await db.playList.findMany({
            where : {
                private : false,
                name : {
                    contains : query,
                    mode : "insensitive"
                }
            }
        });
        
        const fuse = new Fuse(playlists, fuseOptions);
        const result = fuse.search(query);
        if ( result.length > 0 ) {
            return result;
        }
        return null;

    } catch (error) {
        console.error("PLAYLIST SEARCH API ERROR", error);
        return null;
    }
}