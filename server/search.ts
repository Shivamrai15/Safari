"use server";

import Fuse from "fuse.js";
import { db } from "@/lib/db";
import { Album, Song } from "@prisma/client";
import { qdrant } from "@/lib/qdrant";
import { generateEmbeddings } from "@/lib/embedding";


const fuseOptions = {
    keys : ['name'],
    threshold : 0.4
}


type Artist = {
    id: string;
    name: string;
    image: string;
}

export const getTopSearches =  async( query: string ) => {
    try {

        const queryVector = await generateEmbeddings(query);
        const searchPromise = ["album", "song", "artist"].map((collection)=>qdrant.search(
            collection,
            {
                vector: queryVector,
                score_threshold: 0.5,
                limit: 5
            }
        ));
        const [ albumData, songData, artistData ] = await Promise.all(searchPromise);

        const ids = songData.map((v_data)=>v_data.payload?.id as string).filter((id) => id !== undefined);

        const songs = await db.song.findMany({
            where : {
                id : {
                    in: ids
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

        const topResult = (albumData[0].score > songData[0].score)
                            ? (albumData[0].score > artistData[0].score ? albumData[0].payload as Album  : artistData[0].payload as Artist )
                            : (songData[0].score > artistData[0].score ? songs[0] : artistData[0].payload as Artist )
        
        const albums = albumData.map((album)=>album.payload as Album);
        const artists = artistData.map((artist)=>artist.payload as Artist);

        return { albums, artists, songs, topResult }
        
    } catch (error) {
        console.error("TOP SEARCH API ERROR", error);
        return null;
    }
}

export const getAlbumSearches = async( query: string ) => {
    try {

        if (!query) {
            return null;
        }

        const vectoryQuery = await generateEmbeddings(query);

        const data = await qdrant.search("album", {
            vector : vectoryQuery,
            score_threshold : 0.6
        });

        return data;


    } catch (error) {
        console.error("ALBUM SEARCH API ERROR", error);
        return null;
    }
}

export const getSongSearches = async( query: string ) => {
    try {
        
        const queryVector = await generateEmbeddings(query);
        const data = await qdrant.search("song", {
            vector : queryVector,
            score_threshold : 0.5
        });

        const ids = data.map((v_data)=>v_data.payload?.id as string).filter((id) => id !== undefined);
        const songs = await db.song.findMany({
            where : {
                id : {
                    in : ids
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

        songs.sort((a, b)=>ids.indexOf(a.id)-ids.indexOf(b.id));
        return songs;

    } catch (error) {
        console.error("SONGS SEARCH API ERROR", error);
        return null;
    }
}

export const getArtistSearches = async( query: string ) => {
    try {

        if (!query) {
            return null;
        }

        const queryVector = await generateEmbeddings(query);
        const data = await qdrant.search("artist", {
            vector : queryVector,
            score_threshold : 0.5
        });
        return data;

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