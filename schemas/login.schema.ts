import * as z from "zod";

export const LoginSchema = z.object({
    email : z.string().email({
        message : "Your email is required"
    }),
    password : z.string().min(1, {
        message : "Your password is required"
    })
});