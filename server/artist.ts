"use server";

import { db } from "@/lib/db";

export const getArtist = async(id :string) => {
    try {

        const artist = await db.artist.findUnique({
            where : {
                id
            },
            select :{
                id : true,
                name : true,
                thumbnail : true,
                image : true,
                about : true,
                songs : {
                    include : {
                        artists : true,
                        album : true
                    },
                    orderBy : {
                        view : {
                            _count : "desc"
                        }
                    },
                    take : 5
                },
                _count : {
                    select :{
                        followers : true
                    }
                }
            }
        });

        return artist;

    } catch (error) {
        console.error("GET ARTIST SERVER ERROR");
        return null;
    }
}

export const getAlbumByArtist = async( id : string ) => {
    try {
        
        const albums = await db.album.findMany({
            where : {
                songs : {
                    some : {
                        artistIds : {
                            has : id
                        }
                    }
                }
            },
            take : 10,
            orderBy : {
                release : "desc"
            },
            distinct : "name"
        });

        return albums;

    } catch (error) {
        console.error("GET ALBUM BY ARTIST SERVER ERROR");
        return [];
    }
}

export const getArtistProfileById = async( id : string ) => {
    try {
        
        const artist = await db.artist.findUnique({
            where : {
                id
            },
            select : {
                id : true,
                name : true,
                image : true,
                _count : {
                    select : {
                        followers : true,
                        songs : true
                    }
                }
            }
        });

        return artist;

    } catch (error) {
        console.error("GET ARTIST PROFILE SERVER ERROR");
        return null;
    }
}

export const getArtists = async () => {
    try {
        
        const artists = await db.artist.findMany({
            select : {
                id : true
            }
        });

        return artists;

    } catch (error) {
        console.log("ARTISTS GET SERVER ERROR", error);
        return [];
    }
}

export const getArtistName = async( id: string )=> {
    try {

        const artist = await db.artist.findUnique({
            where : {
                id
            },
            select : {
                id: true,
                name : true
            }
        });

        return artist
        
    } catch (error) {
        console.log(error);
        return null;
    }
}