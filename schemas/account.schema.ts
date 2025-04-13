import * as z from "zod";

export const AccountSchema = z.object({
    showRecommendations : z.boolean(),
    privateSession : z.boolean(),
});