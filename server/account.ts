"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import speakeasy from "speakeasy";

export const getArchivedPlaylists = async()=>{
    try {
        
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return {
                success : false,
                data : []
            }
        }
        const playlists = await db.playList.findMany({
            where : {
                userId : session.user.id,
                isArchived : true
            },
            select : {
                id : true,
                name : true,
                archivedAt : true,
                _count : {
                    select : {
                        songs : true
                    }
                }
            },
            orderBy : {
                archivedAt : "desc"
            }
        });

        return {
            success : true,
            data : playlists
        }

    } catch (error) {
        console.log(error);
        return {
            success : false,
            data : []
        }
    }
}


export const getAccountDetails = async()=>{
    try {
        
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return null;
        }

        const user = await db.user.findUnique({
            where : {
                id : session.user.id
            },
            select : {
                accountVerified : true,
                accounts : {
                    select : {
                        provider : true
                    }
                }
            }
        });

        return user;

    } catch (error) {
        console.log("GET ACCOUNT API ERROR");
        return null;
    }
}


export const get2FAStatus = async()=>{
    try {
        
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return null;
        }

        const twoFactor = await db.user.findUnique({
            where : {
                id  : session.user.id
            },
            select : {
                twoFactorEnabled : true,
                password : true
            }
        });
        
        return {
            twoFactorEnabled : twoFactor?.twoFactorEnabled,
            isAuthorized : twoFactor?.password ? true : false
        };

    } catch (error) {
        console.log("GET 2FA STATUS API ERROR");
        return null;
    }
}