import test from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { redisClient } from "../config/redis";
import OlympiadCooldown from "../models/olympiadCooldown";
import User from "../../../models/user";
import { QuestionBankService } from "./questionBankService";
import { AttemptService } from "./attemptService";
import { SubmissionService } from "./submissionService";
import { CooldownService } from "./cooldownService";
import { OptionLabel } from "../constants/olympiadConstants";

// Redis Mock Store
const mockRedisStore: Record<string, { value: string; expiry: number }> = {};

(redisClient as any).get = async (key: string): Promise<string | null> => {
  const item = mockRedisStore[key];
  if (!item) return null;
  if (Date.now() > item.expiry) {
    delete mockRedisStore[key];
    return null;
  }
  return item.value;
};

(redisClient as any).setex = async (key: string, ttl: number, val: string): Promise<string> => {
  mockRedisStore[key] = {
    value: val,
    expiry: Date.now() + ttl * 1000,
  };
  return "OK";
};

(redisClient as any).del = async (...keys: string[]): Promise<number> => {
  let count = 0;
  for (const k of keys) {
    if (mockRedisStore[k]) {
      delete mockRedisStore[k];
      count++;
    }
  }
  return count;
};

(redisClient as any).ttl = async (key: string): Promise<number> => {
  const item = mockRedisStore[key];
  if (!item) return -2;
  const rem = Math.floor((item.expiry - Date.now()) / 1000);
  return rem > 0 ? rem : -1;
};

// MongoDB Mock Store
let mockUserLevel: string | null = "6-8";
let mockUserExists = true;

(User as any).findById = (id: any) => {
  if (!mockUserExists) {
    return {
      select: () => Promise.resolve(null),
    };
  }
  return {
    select: () =>
      Promise.resolve({
        _id: id,
        level: mockUserLevel,
      }),
  };
};

const mockCooldownRecords: any[] = [];
(OlympiadCooldown as any).create = async (doc: any) => {
  mockCooldownRecords.push(doc);
  return doc;
};
(OlympiadCooldown as any).findOne = async (query: any) => {
  const userIdStr = query.userId.toString();
  const now = new Date();
  const match = mockCooldownRecords.find(
    (c) => c.userId.toString() === userIdStr && c.cooldownUntil > now
  );
  return match || null;
};

test("CooldownService & SubmissionService Tests", async (t) => {
  // Initialize Question Cache
  QuestionBankService.getInstance().initialize();

  t.beforeEach(() => {
    // Clear mocks
    for (const key of Object.keys(mockRedisStore)) {
      delete mockRedisStore[key];
    }
    mockCooldownRecords.length = 0;
    mockUserLevel = "6-8";
    mockUserExists = true;
  });

  await t.test("CooldownService: should report inCooldown as false initially", async () => {
    const status = await CooldownService.isUserInCooldown("user1");
    assert.strictEqual(status.inCooldown, false);
    assert.strictEqual(status.cooldownUntil, null);
  });

  await t.test("CooldownService: should set and enforce a 24-hour cooldown", async () => {
    const userId = "user1";
    const submittedAt = new Date();

    await CooldownService.createCooldown(userId, submittedAt);

    // Verify it is cached in Redis
    const cacheKey = `olympiad:cooldown:${userId}`;
    const cacheVal = mockRedisStore[cacheKey];
    assert.ok(cacheVal);

    // Verify cooldown status reports true
    const status = await CooldownService.isUserInCooldown(userId);
    assert.strictEqual(status.inCooldown, true);
    assert.ok(status.cooldownUntil);
    const diff = status.cooldownUntil.getTime() - submittedAt.getTime();
    const diffSeconds = Math.round(diff / 1000);
    assert.ok(diffSeconds >= 86390 && diffSeconds <= 86400);
  });

  await t.test("SubmissionService: should throw error if no session exists", async () => {
    await assert.rejects(async () => {
      await SubmissionService.submitAttempt("user_without_session");
    }, /No active examination session found/);
  });

  await t.test("SubmissionService: should throw error if user does not own session", async () => {
    const userId = "user_owner";
    const session = await AttemptService.getOrCreateSession(userId);

    // Swap mapping to map different user to this attemptId
    const otherUserId = "user_other";
    const otherActiveKey = `olympiad:user:${otherUserId}:active`;
    mockRedisStore[otherActiveKey] = {
      value: session.attemptId,
      expiry: Date.now() + 65 * 60 * 1000,
    };

    await assert.rejects(async () => {
      await SubmissionService.submitAttempt(otherUserId);
    }, /Unauthorized/);
  });

  await t.test("SubmissionService: should calculate score and enforce cooldown correctly", async () => {
    const userId = "student_scorer";
    const session = await AttemptService.getOrCreateSession(userId);

    // Answer 5 questions: 3 correctly, 2 incorrectly
    const bank = QuestionBankService.getInstance();
    
    // Q1 Correct
    const q1 = session.questionOrder[0];
    const correct1 = bank.getQuestionById(q1)!.correctOption;
    await AttemptService.saveAnswer(userId, q1, correct1);

    // Q2 Correct
    const q2 = session.questionOrder[1];
    const correct2 = bank.getQuestionById(q2)!.correctOption;
    await AttemptService.saveAnswer(userId, q2, correct2);

    // Q3 Correct
    const q3 = session.questionOrder[2];
    const correct3 = bank.getQuestionById(q3)!.correctOption;
    await AttemptService.saveAnswer(userId, q3, correct3);

    // Q4 Wrong
    const q4 = session.questionOrder[3];
    const wrong4 = bank.getQuestionById(q4)!.correctOption === OptionLabel.A ? OptionLabel.B : OptionLabel.A;
    await AttemptService.saveAnswer(userId, q4, wrong4);

    // Q5 Wrong
    const q5 = session.questionOrder[4];
    const wrong5 = bank.getQuestionById(q5)!.correctOption === OptionLabel.A ? OptionLabel.B : OptionLabel.A;
    await AttemptService.saveAnswer(userId, q5, wrong5);

    // Remaining 55 are unanswered.
    // Score should be: (3 * 4) + (2 * -1) + (55 * 0) = 12 - 2 = 10.
    const result = await SubmissionService.submitAttempt(userId);

    assert.strictEqual(result.finalScore, 10);
    assert.strictEqual(result.correctAnswersCount, 3);
    assert.strictEqual(result.wrongAnswersCount, 2);
    assert.strictEqual(result.unansweredCount, 55);

    // Verify Redis cleanup
    const userActiveKey = `olympiad:user:${userId}:active`;
    const attemptKey = `olympiad:attempt:${session.attemptId}`;
    assert.strictEqual(mockRedisStore[userActiveKey], undefined);
    assert.strictEqual(mockRedisStore[attemptKey], undefined);

    // Verify Cooldown was persisted in DB and cache
    const cooldownStatus = await CooldownService.isUserInCooldown(userId);
    assert.strictEqual(cooldownStatus.inCooldown, true);
  });

  await t.test("SubmissionService: should reject double submissions atomically", async () => {
    const userId = "student_double_sub";
    await AttemptService.getOrCreateSession(userId);

    // First submission succeeds
    await SubmissionService.submitAttempt(userId);

    // Second concurrent/immediate submission fails
    await assert.rejects(async () => {
      await SubmissionService.submitAttempt(userId);
    }, /No active examination session found/);
  });

  await t.test("AttemptService: should refuse to generate session if cooldown active", async () => {
    const userId = "student_cooldown_block";
    await AttemptService.getOrCreateSession(userId);
    await SubmissionService.submitAttempt(userId);

    // Try starting another session
    await assert.rejects(async () => {
      await AttemptService.getOrCreateSession(userId);
    }, /Cooldown is active/);
  });
});
