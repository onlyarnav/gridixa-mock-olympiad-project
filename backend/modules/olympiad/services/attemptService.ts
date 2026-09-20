import crypto from "crypto";
import User from "../../../models/user";
import { redisClient } from "../config/redis";
import { QuestionEngineService } from "./questionEngineService";
import { QuestionBankService } from "./questionBankService";
import { mapDbLevelToOlympiad, OptionLabel } from "../constants/olympiadConstants";
import { IOlympiadSession } from "../types";
import { olympiadConfig } from "../config/olympiadConfig";
import { CooldownService } from "./cooldownService";

const REDIS_TTL = 65 * 60; // 65 minutes in seconds
const EXAM_DURATION = 60 * 60 * 1000; // 60 minutes in ms

export class AttemptService {
  /**
   * Helper to get active keys.
   */
  private static getUserActiveKey(userId: string): string {
    return `olympiad:user:${userId}:active`;
  }

  private static getAttemptKey(attemptId: string): string {
    return `olympiad:attempt:${attemptId}`;
  }

  /**
   * Helper to handle Redis operation safely with custom error handling.
   */
  private static async runRedis<T>(op: () => Promise<T>): Promise<T> {
    try {
      return await op();
    } catch (err: any) {
      console.error("[Olympiad Redis] Service operation failed:", err.message);
      throw new Error(`[Olympiad Redis] Database is currently unavailable.`);
    }
  }

  /**
   * Retrieves the active session for a user if it exists and has not expired.
   * Returns null if no session is active.
   */
  public static async getActiveSession(userId: string): Promise<IOlympiadSession | null> {
    const userActiveKey = this.getUserActiveKey(userId);

    const attemptId = await this.runRedis(() => redisClient.get(userActiveKey));
    if (!attemptId) {
      return null;
    }

    const attemptKey = this.getAttemptKey(attemptId);
    const sessionJson = await this.runRedis(() => redisClient.get(attemptKey));
    if (!sessionJson) {
      // Map exists but session deleted/expired, clean up map
      await this.runRedis(() => redisClient.del(userActiveKey));
      return null;
    }

    const session = JSON.parse(sessionJson) as IOlympiadSession;

    // Check expiration
    if (Date.now() > session.expiresAt) {
      console.log(`[Olympiad] Active session for user ${userId} expired. Evicting.`);
      await this.runRedis(() => redisClient.del(userActiveKey));
      await this.runRedis(() => redisClient.del(attemptKey));
      return null;
    }

    return session;
  }

  /**
   * Retrieves the existing active session or generates a new one.
   */
  public static async getOrCreateSession(userId: string): Promise<IOlympiadSession> {
    const existing = await this.getActiveSession(userId);
    if (existing) {
      const user = await User.findById(userId).select("level");
      if (user && user.level) {
        const currentDbLevel = mapDbLevelToOlympiad(user.level);
        if (existing.level !== currentDbLevel) {
          console.log(`[Olympiad] Level change detected for user ${userId} (${existing.level} -> ${currentDbLevel}). Evicting active session.`);
          const userActiveKey = this.getUserActiveKey(userId);
          const attemptKey = this.getAttemptKey(existing.attemptId);
          await this.runRedis(() => redisClient.del(userActiveKey));
          await this.runRedis(() => redisClient.del(attemptKey));
        } else {
          console.log(`[Olympiad] Active session found for user ${userId}. Restoring.`);
          return existing;
        }
      } else {
        console.log(`[Olympiad] Active session found for user ${userId}. Restoring.`);
        return existing;
      }
    }

    console.log(`[Olympiad] No active session for user ${userId}. Generating new attempt.`);

    // Check cooldown status before starting a new examination attempt
    const cooldownStatus = await CooldownService.isUserInCooldown(userId);
    if (cooldownStatus.inCooldown) {
      throw new Error(
        "Cannot start attempt: Cooldown is active. You can attempt one mock examination every 24 hours."
      );
    }

    // 1. Fetch user from Mongo database to determine academic level
    const user = await User.findById(userId).select("level");
    if (!user) {
      throw new Error("User not found in database.");
    }
    if (!user.level) {
      throw new Error("User academic level not defined in database profile.");
    }

    const level = mapDbLevelToOlympiad(user.level);

    // 2. Select random set & shuffle questions
    const setKey = QuestionEngineService.selectRandomSet();
    const manifest = QuestionBankService.getInstance().getManifestForLevel(level);
    const setQuestionIds = manifest[setKey];

    if (!setQuestionIds || setQuestionIds.length === 0) {
      throw new Error(`[Olympiad Engine] Failed to load question set "${setKey}" for level "${level}".`);
    }

    const randomizedQuestionOrder = QuestionEngineService.shuffleQuestionIds(setQuestionIds);

    // 3. Setup timestamps
    const startedAt = Date.now();
    const expiresAt = startedAt + EXAM_DURATION;
    const attemptId = crypto.randomUUID();

    const newSession: IOlympiadSession = {
      attemptId,
      userId,
      level,
      questionBankVersion: olympiadConfig.QUESTION_BANK_VERSION,
      set: setKey,
      questionOrder: randomizedQuestionOrder,
      answers: {},
      startedAt,
      expiresAt,
    };

    // 4. Save to Redis
    const userActiveKey = this.getUserActiveKey(userId);
    const attemptKey = this.getAttemptKey(attemptId);

    await this.runRedis(async () => {
      await redisClient.setex(attemptKey, REDIS_TTL, JSON.stringify(newSession));
      await redisClient.setex(userActiveKey, REDIS_TTL, attemptId);
    });

    console.log(`[Olympiad] Examination started: attemptId=${attemptId}, userId=${userId}, level=${level}, set=${setKey}`);
    return newSession;
  }

  /**
   * Saves or updates an answer for a specific question in the user's active session.
   * Performs ownership, validity, and expiration checks.
   */
  public static async saveAnswer(
    userId: string,
    questionId: string,
    selectedOption: string | null
  ): Promise<IOlympiadSession> {
    const userActiveKey = this.getUserActiveKey(userId);
    const attemptId = await this.runRedis(() => redisClient.get(userActiveKey));
    if (!attemptId) {
      throw new Error("No active examination session found.");
    }

    const attemptKey = this.getAttemptKey(attemptId);
    const sessionJson = await this.runRedis(() => redisClient.get(attemptKey));
    if (!sessionJson) {
      // Clean up mapping since the session doesn't exist
      await this.runRedis(() => redisClient.del(userActiveKey));
      throw new Error("No active examination session found.");
    }

    const session = JSON.parse(sessionJson) as IOlympiadSession;

    // Ownership check
    if (session.userId !== userId) {
      throw new Error("Unauthorized: You do not own this examination session.");
    }

    // Expiration check
    if (Date.now() > session.expiresAt) {
      console.log(`[Olympiad] Active session for user ${userId} expired. Evicting.`);
      await this.runRedis(() => redisClient.del(userActiveKey));
      await this.runRedis(() => redisClient.del(attemptKey));
      throw new Error("This examination session has expired.");
    }

    // Validity check (verify question belongs to the attempt set)
    if (!session.questionOrder.includes(questionId)) {
      throw new Error("Invalid question: This question does not belong to your examination set.");
    }

    // Option label validation
    if (selectedOption !== null && selectedOption !== "") {
      const validLabels = Object.values(OptionLabel) as string[];
      if (!validLabels.includes(selectedOption)) {
        throw new Error(`Invalid option choice: "${selectedOption}". Must be A, B, C, or D.`);
      }
      session.answers[questionId] = {
        selectedOption,
        answeredAt: Date.now(),
      };
    } else {
      // Clear answer
      delete session.answers[questionId];
    }

    // Save updated session
    await this.runRedis(() => redisClient.setex(attemptKey, REDIS_TTL, JSON.stringify(session)));

    console.log(`[Olympiad] Autosave successful: attemptId=${session.attemptId}, questionId=${questionId}`);
    return session;
  }
}
