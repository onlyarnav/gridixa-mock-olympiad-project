import test from "node:test";
import assert from "node:assert";
import { redisClient } from "../config/redis";
import User from "../../../models/user";
import { OlympiadController } from "./olympiadController";
import { QuestionBankService } from "../services/questionBankService";
import { OptionLabel } from "../constants/olympiadConstants";
import OlympiadCooldown from "../models/olympiadCooldown";

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

(redisClient as any).ttl = async (key: string): Promise<number> => {
  const item = mockRedisStore[key];
  if (!item) return -2;
  const rem = Math.floor((item.expiry - Date.now()) / 1000);
  return rem > 0 ? rem : -1;
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

// Express Request/Response Mock helper
function createMockRequest(userId: string | undefined, body: any = {}, params: any = {}): any {
  return {
    user: userId ? { id: userId, role: "student" } : undefined,
    body,
    params,
  };
}

function createMockResponse(): any {
  const res = {} as any;
  res.statusCode = 200;
  res.jsonData = null;

  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };

  res.json = (data: any) => {
    res.jsonData = data;
    return res;
  };

  return res;
}

test("OlympiadController Tests", async (t) => {
  // Initialize Question Cache
  QuestionBankService.getInstance().initialize();

  t.beforeEach(() => {
    for (const key of Object.keys(mockRedisStore)) {
      delete mockRedisStore[key];
    }
    mockUserLevel = "6-8";
    mockUserExists = true;
    mockCooldownRecords.length = 0;
  });

  await t.test("startAttempt: should start a new session successfully and return sanitized questions", async () => {
    const req = createMockRequest("student_1");
    const res = createMockResponse();

    await OlympiadController.startAttempt(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.jsonData.success);
    assert.ok(res.jsonData.data.attemptId);
    assert.strictEqual(res.jsonData.data.level, "CLASS_6_8");
    assert.strictEqual(res.jsonData.data.questions.length, 60);
    assert.deepStrictEqual(res.jsonData.data.answers, {});

    // Ensure questions are sanitized (no correctOption)
    for (const q of res.jsonData.data.questions) {
      assert.strictEqual(q.hasOwnProperty("correctOption"), false);
      assert.ok(q.id);
      assert.ok(q.question);
      assert.ok(q.options);
    }
  });

  await t.test("startAttempt: should reject request if unauthenticated", async () => {
    const req = createMockRequest(undefined); // No user context
    const res = createMockResponse();

    await OlympiadController.startAttempt(req, res);

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.jsonData.success, false);
    assert.match(res.jsonData.message, /Unauthorized/);
  });

  await t.test("getCurrentSession: should return null if there is no active session", async () => {
    const req = createMockRequest("student_2");
    const res = createMockResponse();

    await OlympiadController.getCurrentSession(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.jsonData.success);
    assert.strictEqual(res.jsonData.data, null);
  });

  await t.test("getCurrentSession: should recover session and questions if active", async () => {
    const userId = "student_3";
    const reqStart = createMockRequest(userId);
    const resStart = createMockResponse();

    await OlympiadController.startAttempt(reqStart, resStart);
    const attemptId = resStart.jsonData.data.attemptId;

    const reqRecovery = createMockRequest(userId);
    const resRecovery = createMockResponse();

    await OlympiadController.getCurrentSession(reqRecovery, resRecovery);

    assert.strictEqual(resRecovery.statusCode, 200);
    assert.ok(resRecovery.jsonData.success);
    assert.strictEqual(resRecovery.jsonData.data.attemptId, attemptId);
    assert.strictEqual(resRecovery.jsonData.data.questions.length, 60);
  });

  await t.test("saveAnswer: should save a valid answer choice successfully", async () => {
    const userId = "student_4";
    const reqStart = createMockRequest(userId);
    const resStart = createMockResponse();

    await OlympiadController.startAttempt(reqStart, resStart);
    const targetQId = resStart.jsonData.data.questions[0].id;

    const reqSave = createMockRequest(userId, {
      questionId: targetQId,
      selectedOption: OptionLabel.C,
    });
    const resSave = createMockResponse();

    await OlympiadController.saveAnswer(reqSave, resSave);

    assert.strictEqual(resSave.statusCode, 200);
    assert.ok(resSave.jsonData.success);

    // Verify it is saved in session details
    const reqRecovery = createMockRequest(userId);
    const resRecovery = createMockResponse();
    await OlympiadController.getCurrentSession(reqRecovery, resRecovery);
    assert.strictEqual(resRecovery.jsonData.data.answers[targetQId].selectedOption, OptionLabel.C);
    assert.strictEqual(typeof resRecovery.jsonData.data.answers[targetQId].answeredAt, "number");
  });

  await t.test("saveAnswer: should fail validation if questionId is empty or wrong option choice", async () => {
    const userId = "student_5";
    const reqStart = createMockRequest(userId);
    const resStart = createMockResponse();
    await OlympiadController.startAttempt(reqStart, resStart);

    const reqSaveEmpty = createMockRequest(userId, {
      questionId: "  ",
      selectedOption: OptionLabel.A,
    });
    const resSaveEmpty = createMockResponse();
    await OlympiadController.saveAnswer(reqSaveEmpty, resSaveEmpty);
    assert.strictEqual(resSaveEmpty.statusCode, 400);

    const reqSaveWrongOption = createMockRequest(userId, {
      questionId: resStart.jsonData.data.questions[0].id,
      selectedOption: "X",
    });
    const resSaveWrongOption = createMockResponse();
    await OlympiadController.saveAnswer(reqSaveWrongOption, resSaveWrongOption);
    assert.strictEqual(resSaveWrongOption.statusCode, 400);
  });

  await t.test("getRemainingTime: should return seconds left for active session", async () => {
    const userId = "student_6";
    const reqStart = createMockRequest(userId);
    const resStart = createMockResponse();
    await OlympiadController.startAttempt(reqStart, resStart);

    const reqTime = createMockRequest(userId);
    const resTime = createMockResponse();
    await OlympiadController.getRemainingTime(reqTime, resTime);

    assert.strictEqual(resTime.statusCode, 200);
    assert.ok(resTime.jsonData.success);
    assert.ok(resTime.jsonData.data.remainingSeconds > 3500);
  });

  await t.test("getRemainingTime: should return 404 if no session is active", async () => {
    const reqTime = createMockRequest("student_no_session");
    const resTime = createMockResponse();
    await OlympiadController.getRemainingTime(reqTime, resTime);

    assert.strictEqual(resTime.statusCode, 404);
    assert.strictEqual(resTime.jsonData.success, false);
  });

  await t.test("submitAttempt: should submit session, calculate score, and set cooldown status", async () => {
    const userId = "student_submit_cntrl";
    const reqStart = createMockRequest(userId);
    const resStart = createMockResponse();
    await OlympiadController.startAttempt(reqStart, resStart);

    // Save one correct answer
    const bank = QuestionBankService.getInstance();
    const q1 = resStart.jsonData.data.questions[0].id;
    const correct1 = bank.getQuestionById(q1)!.correctOption;
    const reqSave = createMockRequest(userId, { questionId: q1, selectedOption: correct1 });
    const resSave = createMockResponse();
    await OlympiadController.saveAnswer(reqSave, resSave);

    // Submit
    const reqSubmit = createMockRequest(userId);
    const resSubmit = createMockResponse();
    await OlympiadController.submitAttempt(reqSubmit, resSubmit);

    assert.strictEqual(resSubmit.statusCode, 200);
    assert.ok(resSubmit.jsonData.success);
    assert.strictEqual(resSubmit.jsonData.data.finalScore, 4); // 1 correct (+4), 59 unanswered (0) = 4
    assert.strictEqual(resSubmit.jsonData.data.correctAnswersCount, 1);
    assert.strictEqual(resSubmit.jsonData.data.unansweredCount, 59);

    // Check cooldown
    const reqCooldown = createMockRequest(userId);
    const resCooldown = createMockResponse();
    await OlympiadController.checkCooldown(reqCooldown, resCooldown);

    assert.strictEqual(resCooldown.statusCode, 200);
    assert.ok(resCooldown.jsonData.success);
    assert.strictEqual(resCooldown.jsonData.data.inCooldown, true);
  });
});
