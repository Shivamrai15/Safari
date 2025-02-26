import * as z from "zod";

export const TwoFactorAuthSchema = z.object({
    token: z.string().length(6).regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});