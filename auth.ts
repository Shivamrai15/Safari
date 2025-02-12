import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
 
export const {
    handlers,
    signIn,
    signOut,
    auth
} = NextAuth({
    pages: {
        signIn: "/login",
        error: "/auth/error"
    },
    events : {
        linkAccount : async({user, account})=>{
            await db.user.update({
                where : {id: user.id },
                data : { emailVerified : new Date() }
            });

        }
    },
    callbacks :{
        async session({session, token}) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({token}){
            return token;
        }
    },

    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})