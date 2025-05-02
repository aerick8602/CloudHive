import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, {
  retryStrategy(times) {
    // Exponential backoff
    return Math.min(times * 50, 2000);
  },
});

export default redis;
