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

        const response = await axios.get(`${process.env.NEXT_PUBLIC_SOCKET_API}/api/v2/search?query=${query}`);
        if ( !response.data ) {
            return null;
        }

        const { topResult, songs, albums, artists } : TopSearchesResponse = response.data;
        return { topResult, songs, albums, artists}

        // const [ albums, artists, songs ] = await Promise.all([
        //     db.album.findMany({
        //         where : {
        //             name : { contains: query, mode : "insensitive" }
        //         }
        //     }),
        //     db.artist.findMany({
        //         where : {
        //             name : { contains: query, mode : "insensitive" }
        //         },
        //         select : {
        //             id : true,
        //             name : true,
        //             image : true
        //         }
        //     }),
        //     db.song.findMany({
        //         where : {
        //             name : { contains: query, mode : "insensitive" }
        //         },
        //         include : {
        //             album : true,
        //             artists : {
        //                 select : {
        //                     id : true,
        //                     image : true,
        //                     name : true
        //                 }
        //             }
        //         }
        //     }),
        // ]);

        // const allDocuments = [...albums, ...artists, ...songs];
        // const bestSearchFuse = new Fuse(allDocuments, fuseOptions);
        // const songFuse = new Fuse(songs, fuseOptions);
        // const albumFuse = new Fuse(albums, fuseOptions);
        // const artistFuse = new Fuse(artists, fuseOptions);

        // const bestSearch = bestSearchFuse.search(query);
        // const albumResults = albumFuse.search(query).slice(0, 5).map((album)=>album.item);
        // const songResults = songFuse.search(query).slice(0, 5).map((song)=>song.item);
        // const artistResults = artistFuse.search(query).slice(0, 5).map((artist)=>artist.item);

        // const topResult = bestSearch.length > 0 ? bestSearch[0].item : null;
        // console.log(topResult);
        
        
    } catch (error) {
        console.error("TOP SEARCH API ERROR", error);
        return null;
    }
}

export const getAlbumSearches = async( query: string ) => {
    try {

        const response = await axios.get(`${process.env.NEXT_PUBLIC_SOCKET_API}/api/v2/search/album?query=${query}`);
        if ( !response.data ) {
            return null;
        }

        const albums : Album[] = response.data;
        return albums;

        // const albums = await db.album.findMany({
        //     where : {
        //         name : {
        //             contains : query,
        //             mode : "insensitive"
        //         }
        //     }
        // });

        // const fuse = new Fuse(albums, fuseOptions);
        // const result = fuse.search(query).map((album)=>album.item);
        // return result
        

    } catch (error) {
        console.error("ALBUM SEARCH API ERROR", error);
        return null;
    }
}

export const getSongSearches = async( query: string ) => {
    try {
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SOCKET_API}/api/v2/search/song?query=${query}`);
        if ( !response.data ) {
            return null;
        }

        const songs : (Song & { album : Album, artists : { id: string, name: string, image: string }[] })[] = response.data;
        return songs;

        // const songs = await db.song.findMany({
        //     where : {
        //         name : {
        //             contains : query,
        //             mode : "insensitive"
        //         }
        //     },
        //     include : {
        //         album : true,
        //         artists : {
        //             select : {
        //                 id : true,
        //                 name : true,
        //                 image : true
        //             }
        //         }
        //     }
        // });

        // const fuse = new Fuse(songs, fuseOptions);
        // const result = fuse.search(query).map((song)=>song.item);
        // return result
        

    } catch (error) {
        console.error("SONGS SEARCH API ERROR", error);
        return null;
    }
}

export const getArtistSearches = async( query: string ) => {
    try {

        const response = await axios.get(`${process.env.NEXT_PUBLIC_SOCKET_API}/api/v2/search/artist?query=${query}`);
        if ( !response.data ) {
            return null;
        }

        const artists : { id: string, name: string, image: string }[] = response.data;
        return artists;
        
        // const artists = await db.artist.findMany({
        //     where : {
        //         name : {
        //             contains : query,
        //             mode : "insensitive"
        //         }
        //     },
        //     select : {
        //         id : true,
        //         name : true,
        //         image : true
        //     }
        // });

        // const fuse = new Fuse(artists, fuseOptions);
        // const result = fuse.search(query).map((artist)=>artist.item);
        // return result

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