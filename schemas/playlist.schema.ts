import * as z from "zod";

export const PlaylistSchema = z.object({
    name : z.string().min(1, {message : "Playlist name is required"}),
    private : z.boolean(),
    description : z.string().optional()
});