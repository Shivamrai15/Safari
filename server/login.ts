"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas/login.schema";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/ratelimit";

export const login = async ( data : z.infer<typeof LoginSchema> ) => {
    try {
        
        const validatedData = await LoginSchema.safeParseAsync(data);
        if (!validatedData.success) {
            return {
                error : "Invalid credentials!"
            }
        }

        const { email, password } = validatedData.data;

        const { success } = await rateLimit.limit(email);
        if (!success) {
            return {
                error : "Too many requests"
            }
        }

        const user = await db.user.findUnique({
            where : {
                email
            }
        });

        if (!user || !user.password) {
            return {
                error : "Account does not exist!"
            }
        }

        const passwordMatched = await bcrypt.compare(password, user.password);
        
        if (!passwordMatched) {
            return {
                error : "Invalid password!"
            }
        }

        if (!user.accountVerified) {
            const verificationToken = await generateVerificationToken(user.email);
            if (!verificationToken) {
                return {
                    error : "Internal server error"
                }
            }

            await sendVerificationEmail( user.email, user?.name || "User", verificationToken);
            return {
                info : "Verification email has been send"
            }
        }

        const value = await signIn("credentials", {
            email,
            password,
            redirectTo: "/",
        });

        return {
            success : "Logged In Successfully"
        }

    } catch (error) {
        
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Internal server error" }
            }
        }
      
        throw error;

    }
}