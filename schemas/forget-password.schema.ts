import * as z from "zod";

export const ForgetPasswordSchema = z.object({
    email : z.string().email({
        message : "Your email is required"
    })
});