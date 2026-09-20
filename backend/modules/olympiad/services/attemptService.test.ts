import test from "node:test";
import assert from "node:assert";
import { redisClient } from "../config/redis";
import User from "../../../models/user";
import { AttemptService } from "./attemptService";
import { QuestionBankService } from "./questionBankService";
import { QuestionEngineService } from "./questionEngineService";
import { AcademicLevel, OptionLabel } from "../constants/olympiadConstants";

// Mock implementation of Redis storage
const mockRedisStore: Record<string, { value: string; expiry: number }> = {};

// Override ioredis client methods for test isolated sandbox
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

// Mock User database model query
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

test("AttemptService Tests", async (t) => {
  // Ensure QuestionBankService is initialized
  QuestionBankService.getInstance().initialize();

  // Reset Redis mock state before each subtest
  t.beforeEach(() => {
    for (const key of Object.keys(mockRedisStore)) {
      delete mockRedisStore[key];
    }
    mockUserLevel = "6-8";
    mockUserExists = true;
  });

  await t.test("should generate a new active session if none exists", async () => {
    const userId = "user123";
    const session = await AttemptService.getOrCreateSession(userId);

    assert.ok(session.attemptId);
    assert.strictEqual(session.userId, userId);
    assert.strictEqual(session.level, AcademicLevel.CLASS_6_8);
    assert.strictEqual(session.questionOrder.length, 60);
    assert.deepStrictEqual(session.answers, {});
    assert.ok(session.startedAt <= Date.now());
    assert.ok(session.expiresAt > Date.now());

    // Verify it is saved in our mock Redis
    const userActiveKey = `olympiad:user:${userId}:active`;
    const activeAttemptId = await redisClient.get(userActiveKey);
    assert.strictEqual(activeAttemptId, session.attemptId);

    const attemptKey = `olympiad:attempt:${session.attemptId}`;
    const attemptJson = await redisClient.get(attemptKey);
    assert.ok(attemptJson);
    const savedSession = JSON.parse(attemptJson!);
    assert.strictEqual(savedSession.attemptId, session.attemptId);
  });

  await t.test("should restore the existing active session on duplicate requests", async () => {
    const userId = "user_restored";
    const firstSession = await AttemptService.getOrCreateSession(userId);
    const secondSession = await AttemptService.getOrCreateSession(userId);

    assert.strictEqual(secondSession.attemptId, firstSession.attemptId);
    assert.deepStrictEqual(secondSession.questionOrder, firstSession.questionOrder);
    assert.strictEqual(secondSession.startedAt, firstSession.startedAt);
  });

  await t.test("should fail session creation if user does not exist in database", async () => {
    mockUserExists = false;
    await assert.rejects(async () => {
      await AttemptService.getOrCreateSession("missing_user");
    }, /User not found/);
  });

  await t.test("should fail session creation if user level is undefined in DB profile", async () => {
    mockUserLevel = null;
    await assert.rejects(async () => {
      await AttemptService.getOrCreateSession("user_no_level");
    }, /academic level not defined/);
  });

  await t.test("should automatically create new session if the existing session has expired", async () => {
    const userId = "user_expired_session";
    const firstSession = await AttemptService.getOrCreateSession(userId);

    // Simulate expiration by rewriting the expiresAt and startedAt in the mock Redis
    const attemptKey = `olympiad:attempt:${firstSession.attemptId}`;
    const expiredSession = {
      ...firstSession,
      startedAt: Date.now() - 70 * 60 * 1000,
      expiresAt: Date.now() - 10 * 60 * 1000,
    };
    mockRedisStore[attemptKey].value = JSON.stringify(expiredSession);

    const secondSession = await AttemptService.getOrCreateSession(userId);
    assert.notStrictEqual(secondSession.attemptId, firstSession.attemptId);
  });

  await t.test("should save a valid answer choice in active session", async () => {
    const userId = "user_saving_answers";
    const session = await AttemptService.getOrCreateSession(userId);
    const targetQId = session.questionOrder[0];

    const updatedSession = await AttemptService.saveAnswer(userId, targetQId, OptionLabel.B);
    assert.strictEqual(updatedSession.answers[targetQId].selectedOption, OptionLabel.B);
    assert.strictEqual(typeof updatedSession.answers[targetQId].answeredAt, "number");

    // Verify it is committed to Redis
    const recovered = await AttemptService.getActiveSession(userId);
    assert.strictEqual(recovered?.answers[targetQId].selectedOption, OptionLabel.B);
  });

  await t.test("should clear the answer choice if option parameter is null or empty string", async () => {
    const userId = "user_clearing_answers";
    const session = await AttemptService.getOrCreateSession(userId);
    const targetQId = session.questionOrder[0];

    // Set it first
    await AttemptService.saveAnswer(userId, targetQId, OptionLabel.C);
    // Clear it
    const clearedSession = await AttemptService.saveAnswer(userId, targetQId, null);
    assert.strictEqual(clearedSession.answers[targetQId], undefined);

    const clearedSession2 = await AttemptService.saveAnswer(userId, targetQId, "");
    assert.strictEqual(clearedSession2.answers[targetQId], undefined);
  });

  await t.test("should throw error if autosave contains an invalid choice label", async () => {
    const userId = "user_invalid_choice";
    const session = await AttemptService.getOrCreateSession(userId);
    const targetQId = session.questionOrder[0];

    await assert.rejects(async () => {
      await AttemptService.saveAnswer(userId, targetQId, "INVALID_LABEL" as any);
    }, /Invalid option choice/);
  });

  await t.test("should throw error if student answers a question ID not in randomized set", async () => {
    const userId = "user_wrong_question";
    await AttemptService.getOrCreateSession(userId);

    await assert.rejects(async () => {
      await AttemptService.saveAnswer(userId, "FOREIGN_QUESTION_ID", OptionLabel.A);
    }, /This question does not belong to your examination set/);
  });

  await t.test("should throw error if trying to save answer for an expired attempt", async () => {
    const userId = "user_expired_save";
    const session = await AttemptService.getOrCreateSession(userId);
    const targetQId = session.questionOrder[0];

    // Force expiration in Redis
    const attemptKey = `olympiad:attempt:${session.attemptId}`;
    const expiredSession = {
      ...session,
      expiresAt: Date.now() - 1000,
    };
    mockRedisStore[attemptKey].value = JSON.stringify(expiredSession);

    await assert.rejects(async () => {
      await AttemptService.saveAnswer(userId, targetQId, OptionLabel.A);
    }, /session has expired/);
  });
});
