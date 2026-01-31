"use server";

import Fuse from "fuse.js";
import { db } from "@/lib/db";
import { Album } from "@prisma/client";
import { cache } from "react";
import { Artist, RawAlbum, RawArtist, RawSong } from "@/types";


const fuseOptions = {
    keys : ['name'],
    threshold : 0.4
}

export const getTopSearches = cache(async (query: string) => {
    try {
        if (!query) {
            return null;
        }

        const albumSearchPipeline = [
            {
                $search: {
                    index: "default",
                    text: {
                        query,
                        path: "name",
                        fuzzy: { maxEdits: 2 }
                    }
                }
            },
            {
                $addFields: {
                    score: { $meta: "searchScore" }
                }
            },
            {
                $limit: 5
            }
        ];

        const artistSearchPipeline = [
            {
                $search: {
                    index: "default",
                    text: {
                        query,
                        path: "name",
                        fuzzy: { maxEdits: 2 }
                    }
                }
            },
            {
                $addFields: {
                    score: { $meta: "searchScore" }
                }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    thumbnail: 0,
                    about: 0,
                    songIds: 0,
                    followerIds: 0
                }
            }
        ];

        const songSearchPipeline = [
            {
                $search: {
                    index: "default",
                    text: {
                        query,
                        path: "name",
                        fuzzy: { maxEdits: 2 }
                    }
                }
            },
            {
                $addFields: {
                    score: { $meta: "searchScore" }
                }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "Album",
                    localField: "albumId",
                    foreignField: "_id",
                    as: "album"
                }
            },
            {
                $unwind: "$album"
            },
            {
                $lookup: {
                    from: "Artist",
                    localField: "artistIds",
                    foreignField: "_id",
                    as: "artists"
                }
            },
            {
                $project: {
                    "artists.thumbnail": 0,
                    "artists.about": 0,
                    "artists.songIds": 0,
                    "artists.followerIds": 0
                }
            }
        ];

        const [rawAlbums, rawSongs, rawArtists] = await Promise.all([
            db.album.aggregateRaw({ pipeline: albumSearchPipeline }) as unknown as (RawAlbum & { score: number })[],
            db.song.aggregateRaw({ pipeline: songSearchPipeline }) as unknown as (RawSong & { score: number })[],
            db.artist.aggregateRaw({ pipeline: artistSearchPipeline }) as unknown as (RawArtist & { score: number })[]
        ]);

        const albums: Album[] = rawAlbums.map((album) => ({
            id: album._id.$oid,
            name: album.name,
            image: album.image,
            color: album.color,
            release: new Date(album.release.$date),
            labelId: album.labelId?.$oid ?? null
        }));

        const artists: Artist[] = rawArtists.map((artist) => ({
            id: artist._id.$oid,
            name: artist.name,
            image: artist.image
        }));

        const songs = rawSongs.map((song) => ({
            id: song._id.$oid,
            name: song.name,
            image: song.image,
            url: song.url,
            duration: song.duration,
            albumId: song.albumId.$oid,
            artistIds: song.artistIds.map((id) => id.$oid),
            album: {
                id: song.album._id.$oid,
                name: song.album.name,
                image: song.album.image,
                color: song.album.color,
                release: new Date(song.album.release.$date),
                labelId: song.album.labelId?.$oid ?? null
            },
            artists: song.artists.map((artist) => ({
                id: artist._id.$oid,
                name: artist.name,
                image: artist.image
            }))
        }));

        let topResult: Album | Artist | typeof songs[0] | null = null;

        if (rawAlbums.length === 0 && rawSongs.length === 0 && rawArtists.length === 0) {
            topResult = null;
        } else {
            const albumScore = rawAlbums.length > 0 ? rawAlbums[0].score : -Infinity;
            const songScore = rawSongs.length > 0 ? rawSongs[0].score : -Infinity;
            const artistScore = rawArtists.length > 0 ? rawArtists[0].score : -Infinity;

            if (albumScore >= songScore && albumScore >= artistScore) {
                topResult = albums[0];
            } else if (songScore >= albumScore && songScore >= artistScore) {
                topResult = songs[0];
            } else {
                topResult = artists[0];
            }
        }

        return { albums, artists, songs, topResult };

    } catch (error) {
        console.error("TOP SEARCH API ERROR", error);
        return null;
    }
});


export const getAlbumSearches = cache(async( query: string ) => {
    try {

        if (!query) {
            return null;
        }

        const result = await db.album.aggregateRaw({
            pipeline: [
                {
                    $search: {
                        index: "default",
                        text: {
                            query,
                            path: "name",
                            fuzzy: { maxEdits: 2 }
                        }
                    }
                },
                {
                    $addFields: {
                        score: { $meta: "searchScore" }
                    }
                },
                {
                    $setWindowFields: {
                        output: {
                            maxScore: { $max: "$score" }
                        }
                    }
                },
                {
                    $match: {
                        $expr: {
                            $gte: ["$score", { $multiply: ["$maxScore", 0.5] }]
                        }
                    }
                },
                {
                    $limit: 20
                },
                {
                    $project: {
                        score: 0,
                        maxScore: 0
                    }
                }
            ]
        }) as unknown as RawAlbum[];

        const albums: Album[] = result.map((album) => ({
            id: album._id.$oid,
            name: album.name,
            image: album.image,
            color: album.color,
            release: new Date(album.release.$date),
            labelId: album.labelId?.$oid ?? null
        }));

        console.log("ALBUM SEARCH RESULTS:", albums);

        return albums;

    } catch (error) {
        console.error("ALBUM SEARCH API ERROR", error);
        return null;
    }
});


export const getSongSearches = cache(async( query: string ) => {
    try {

        if (!query) {
            return null;
        }

        const result = await db.song.aggregateRaw({
            pipeline: [
                {
                    $search: {
                        index: "default",
                        text: {
                            query,
                            path: "name",
                            fuzzy: { maxEdits: 2 }
                        }
                    }
                },
                {
                    $addFields: {
                        score: { $meta: "searchScore" }
                    }
                },
                {
                    $setWindowFields: {
                        output: {
                            maxScore: { $max: "$score" }
                        }
                    }
                },
                {
                    $match: {
                        $expr: {
                            $gte: ["$score", { $multiply: ["$maxScore", 0.5] }]
                        }
                    }
                },
                {
                    $limit: 20
                },
                {
                    $lookup: {
                        from: "Album",
                        localField: "albumId",
                        foreignField: "_id",
                        as: "album"
                    }
                },
                {
                    $unwind: "$album"
                },
                {
                    $lookup: {
                        from: "Artist",
                        localField: "artistIds",
                        foreignField: "_id",
                        as: "artists"
                    }
                },
                {
                    $project: {
                        score: 0,
                        maxScore: 0,
                        "artists.thumbnail": 0,
                        "artists.about": 0,
                        "artists.songIds": 0,
                        "artists.followerIds": 0
                    }
                }
            ]
        }) as unknown as RawSong[];

        const songs = result.map((song) => ({
            id: song._id.$oid,
            name: song.name,
            image: song.image,
            url: song.url,
            duration: song.duration,
            albumId: song.albumId.$oid,
            artistIds: song.artistIds.map((id) => id.$oid),
            album: {
                id: song.album._id.$oid,
                name: song.album.name,
                image: song.album.image,
                color: song.album.color,
                release: new Date(song.album.release.$date),
                labelId: song.album.labelId?.$oid ?? null
            },
            artists: song.artists.map((artist) => ({
                id: artist._id.$oid,
                name: artist.name,
                image: artist.image
            }))
        }));

        return songs;

    } catch (error) {
        console.error("SONGS SEARCH API ERROR", error);
        return null;
    }
});


export const getArtistSearches = cache(async( query: string ) => {
    try {

        if (!query) {
            return null;
        }

        const result = await db.artist.aggregateRaw({
            pipeline: [
                {
                    $search: {
                        index: "default",
                        text: {
                            query,
                            path: "name",
                            fuzzy: { maxEdits: 2 }
                        }
                    }
                },
                {
                    $addFields: {
                        score: { $meta: "searchScore" }
                    }
                },
                {
                    $setWindowFields: {
                        output: {
                            maxScore: { $max: "$score" }
                        }
                    }
                },
                {
                    $match: {
                        $expr: {
                            $gte: ["$score", { $multiply: ["$maxScore", 0.75] }]
                        }
                    }
                },
                {
                    $limit: 20
                },
                {
                    $project: {
                        score: 0,
                        maxScore: 0
                    }
                }
            ]
        }) as unknown as RawArtist[];

        const artists: Artist[] = result.map((artist) => ({
            id: artist._id.$oid,
            name: artist.name,
            image: artist.image
        }));

        

        return artists;

    } catch (error) {
        console.error("ARTIST SEARCH API ERROR", error);
        return null;
    }
});


export const getPlaylistSearches = cache(async( query : string ) => {
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
})