"use server";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/user";
import jwt from "jsonwebtoken";

export const tokenVerification = async ( verificationToken: string ) => {
    try {
        
        const verifiedToken = jwt.verify(verificationToken, process.env.VERIFICATION_SECRET!);
        
        if (!verifiedToken) {
            return { error: "Your verification link is not valid, or already used." };
        }

        // @ts-ignore
        const email : string | undefined =  verifiedToken["email"];
        // @ts-ignore
        const token : string | undefined =  verifiedToken["token"];


        if ( !email && !token ) {
            return { error: "Your verification link is not valid, or already used." };
        }

        const dbToken = await db.verificationToken.findFirst({
            where : {
                token,
                email
            }
        });

        if ( !dbToken ) {
            return { error : "Your verification link is not valid, or already used." };
        }

        const hasExpired = new Date() > new Date(dbToken.expires);
        if (hasExpired) {
            return {
                error : "Your verification link is not valid, or already used."
            }
        }

        const existingUser = await getUserByEmail(dbToken.email);
        if (!existingUser || !existingUser.password){
            return {
                error : "Account does not exists"
            }
        }

        await db.user.update({
            where : {
                id : existingUser.id
            },
            data  : {
                accountVerified : new Date()
            }
        });

        await db.verificationToken.delete({
            where : {
                id : dbToken.id
            }
        });

        return {
            success : "Email verified successfully"
        }

    } catch (error ) {
        if ( error instanceof jwt.TokenExpiredError ) {
            return { error: "Your verification link is not valid, or already used." };
        }
        console.log("TOKEN VERIFICATION SERVER ERROR", error);
        return { error : "Internal server error" }
    }
}