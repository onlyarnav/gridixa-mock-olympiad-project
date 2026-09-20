import mongoose from "mongoose";
import { redisClient } from "../config/redis";
import OlympiadCooldown from "../models/olympiadCooldown";

export interface ICooldownStatus {
  inCooldown: boolean;
  cooldownUntil: Date | null;
}

export class CooldownService {
  private static getCooldownKey(userId: string): string {
    return `olympiad:cooldown:${userId}`;
  }

  private static async runRedis<T>(op: () => Promise<T>): Promise<T> {
    try {
      return await op();
    } catch (err: any) {
      console.error("[Olympiad Cooldown Redis] Operation failed:", err.message);
      throw new Error("[Olympiad Redis] Database is currently unavailable.");
    }
  }

  private static parseUserId(userId: string): any {
    return mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;
  }

  /**
   * Checks if a user is currently in their 24-hour examination cooldown.
   * Checks Redis cache first, then falls back to MongoDB.
   */
  public static async isUserInCooldown(userId: string): Promise<ICooldownStatus> {
    const cooldownKey = this.getCooldownKey(userId);

    // 1. Check Redis cache
    const cacheVal = await this.runRedis(() => redisClient.get(cooldownKey));
    if (cacheVal) {
      // Parse the stored date if possible, otherwise compute it roughly from Redis TTL
      const ttl = await this.runRedis(() => redisClient.ttl(cooldownKey));
      const cooldownUntil = new Date(Date.now() + (ttl > 0 ? ttl : 0) * 1000);
      return {
        inCooldown: true,
        cooldownUntil,
      };
    }

    // 2. Check MongoDB (source of truth)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        inCooldown: false,
        cooldownUntil: null,
      };
    }

    const activeCooldown = await OlympiadCooldown.findOne({
      userId: this.parseUserId(userId),
      cooldownUntil: { $gt: new Date() },
    });

    if (activeCooldown) {
      const remainingMs = activeCooldown.cooldownUntil.getTime() - Date.now();
      const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));

      if (remainingSeconds > 0) {
        // Cache in Redis for the remaining cooldown duration
        await this.runRedis(() =>
          redisClient.setex(cooldownKey, remainingSeconds, activeCooldown.cooldownUntil.toISOString())
        );
      }

      return {
        inCooldown: true,
        cooldownUntil: activeCooldown.cooldownUntil,
      };
    }

    return {
      inCooldown: false,
      cooldownUntil: null,
    };
  }

  /**
   * Creates a new 24-hour cooldown for a user starting from submittedAt.
   * Persists to MongoDB and caches to Redis.
   */
  public static async createCooldown(userId: string, submittedAt: Date): Promise<void> {
    const cooldownKey = this.getCooldownKey(userId);
    const cooldownDurationSeconds = 24 * 60 * 60; // 24 hours
    const cooldownUntil = new Date(submittedAt.getTime() + cooldownDurationSeconds * 1000);

    // 1. Persist in MongoDB
    if (mongoose.Types.ObjectId.isValid(userId)) {
      await OlympiadCooldown.create({
        userId: this.parseUserId(userId),
        submittedAt,
        cooldownUntil,
      });
    }

    // 2. Cache in Redis
    await this.runRedis(() =>
      redisClient.setex(cooldownKey, cooldownDurationSeconds, cooldownUntil.toISOString())
    );

    console.log(`[Olympiad Cooldown] Cooldown set for user ${userId} until ${cooldownUntil.toISOString()}`);
  }
}
