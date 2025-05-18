import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL environment variable is not set");
}

const redis = new Redis(process.env.REDIS_URL, {
  // retryStrategy(times) {
  //   // Exponential backoff
  //   return Math.min(times * 50, 2000);
  // },
  // maxRetriesPerRequest: 3,
  // enableReadyCheck: true,
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

redis.on("connect", () => {
  console.log("Successfully connected to Redis");
});

export default redis;
