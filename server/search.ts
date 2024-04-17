"use server";

import { db } from "@/lib/db";
import Fuse from "fuse.js";

const fuseOptions = {
    keys : ['name'],
    threshold : 0.4
}

export const getTopSearches =  async( query: string ) => {
    try {

        const [ albums, artists, songs ] = await Promise.all([
            db.album.findMany({
                where : {
                    name : { contains: query, mode : "insensitive" }
                }
            }),
            db.artist.findMany({
                where : {
                    name : { contains: query, mode : "insensitive" }
                }
            }),
            db.song.findMany({
                where : {
                    name : { contains: query, mode : "insensitive" }
                },
                include : {
                    album : true,
                    artists : true
                }
            }),
        ]);

        const allDocuments = [...albums, ...artists, ...songs];
        const bestSearchFuse = new Fuse(allDocuments, fuseOptions);
        const songFuse = new Fuse(songs, fuseOptions);
        const albumFuse = new Fuse(albums, fuseOptions);
        const artistFuse = new Fuse(artists, fuseOptions);

        const bestSearch = bestSearchFuse.search(query);
        const albumResults = albumFuse.search(query).slice(0, 5);
        const songResults = songFuse.search(query).slice(0, 5);
        const artistResults = artistFuse.search(query).slice(0, 5);

        const bestResult = bestSearch.length > 0 ? bestSearch[0] : null;

        return { bestResult, albumResults, songResults, artistResults }
        
    } catch (error) {
        console.error("TOP SEARCH API ERROR", error);
        return null;
    }
}