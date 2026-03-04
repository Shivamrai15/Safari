import * as z from "zod";

export const HistorySchema = z.array(z.object({
    userId: z.string(),
    trackId: z.string(),
    songDuration: z.number(),
    playedDuration: z.number(),
    playedAt: z.string().transform((val) => new Date(val).toISOString()),
}));