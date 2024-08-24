"use server";

import axios from "axios";
import Fuse from "fuse.js";
import { db } from "@/lib/db";
import { Album, Song } from "@prisma/client";

const fuseOptions = {
    keys : ['name'],
    threshold : 0.4
}

interface TopSearchesResponse {
    topResult :  Album | ( Song & { album : Album, artists : { id: string, name: string, image: string }[] } ) | { id: string, name: string, image: string };
    songs : ( Song & { album : Album, artists : { id: string, name: string, image: string }[] } )[];
    albums : Album[]
    artists : { id: string, name: string, image: string }[] 
}

export const getTopSearches =  async( query: string ) => {
    try {

        const response = await axios.get(`http://localhost:8080/api/v2/search?query=${query}`);
        if ( !response.data ) {
            return null;
        }

        const { topResult, songs, albums, artists } : TopSearchesResponse = response.data;
        return { topResult, songs, albums, artists}
        
        
    } catch (error) {
        console.error("TOP SEARCH API ERROR", error);
        return null;
    }
}

export const getAlbumSearches = async( query: string ) => {
    try {

        const response = await axios.get(`http://localhost:8080/api/v2/search/album?query=${query}`);
        if ( !response.data ) {
            return null;
        }

        const albums : Album[] = response.data;
        return albums;

    } catch (error) {
        console.error("ALBUM SEARCH API ERROR", error);
        return null;
    }
}

export const getSongSearches = async( query: string ) => {
    try {
        
        const response = await axios.get(`http://localhost:8080/api/v2/search/song?query=${query}`);
        if ( !response.data ) {
            return null;
        }

        const songs : (Song & { album : Album, artists : { id: string, name: string, image: string }[] })[] = response.data;
        return songs;

    } catch (error) {
        console.error("SONGS SEARCH API ERROR", error);
        return null;
    }
}

export const getArtistSearches = async( query: string ) => {
    try {

        const response = await axios.get(`http://localhost:8080/api/v2/search/artist?query=${query}`);
        if ( !response.data ) {
            return null;
        }

        const artists : { id: string, name: string, image: string }[] = response.data;
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