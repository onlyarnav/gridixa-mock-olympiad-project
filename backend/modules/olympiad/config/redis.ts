import Redis from "ioredis";
import { olympiadConfig } from "./olympiadConfig";

let redisClient: Redis;

try {
  redisClient = new Redis(olympiadConfig.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 5) {
        console.warn(`[Olympiad Redis] Max retries reached. Redis connection suspended.`);
        return null; // stop retrying
      }
      return 2000;
    },
  });

  redisClient.on("connect", () => {
    console.log("[Olympiad Redis] Connected successfully to Redis server.");
  });

  redisClient.on("error", (err) => {
    console.error("[Olympiad Redis] Client Error:", err.message);
  });

  redisClient.on("close", () => {
    console.warn("[Olympiad Redis] Connection closed.");
  });
} catch (err: any) {
  console.error("[Olympiad Redis] Failed to initialize client:", err.message);
  throw err;
}

export { redisClient };
