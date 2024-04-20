"use server";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export const generateVerificationToken = async ( email: string ) => {
    try {

        const token = nanoid();
        const expires = new Date( new Date().getTime() + 600000 );

        const existingToken = await db.verificationToken.findFirst({
            where : {
                email
            }
        });

        if (existingToken) {
            await db.verificationToken.deleteMany({
                where : {
                    email
                }
            });
        }

        await db.verificationToken.create({
            data : {
                token,
                email,
                expires
            }
        });

        const verificationToken = jwt.sign(
            {
                token,
                email
            },
            process.env.VERIFICATION_SECRET!,
            { expiresIn : "10m"}
        )
        
        return verificationToken;

    } catch (error) {
        console.error("GENERATE VERIFICATION TOKEN ERROR", error);
        return null;
    }
}