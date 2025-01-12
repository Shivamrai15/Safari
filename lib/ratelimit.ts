import { Ratelimit } from "@upstash/ratelimit";
import { redisClient } from "./redis";


export const rateLimit = new Ratelimit({
    redis : redisClient,
    limiter : Ratelimit.slidingWindow(5, "1m"),
    enableProtection: true,
    analytics: true,
    prefix : "@upstash/ratelimit"
});
