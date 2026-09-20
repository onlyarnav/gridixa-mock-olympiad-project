import { redisClient } from "../config/redis";
import { QuestionBankService } from "./questionBankService";
import { CooldownService } from "./cooldownService";
import { IOlympiadSession } from "../types";

export interface ISubmissionResult {
  finalScore: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  unansweredCount: number;
  questions: any[];
}

export class SubmissionService {
  private static getUserActiveKey(userId: string): string {
    return `olympiad:user:${userId}:active`;
  }

  private static getAttemptKey(attemptId: string): string {
    return `olympiad:attempt:${attemptId}`;
  }

  private static async runRedis<T>(op: () => Promise<T>): Promise<T> {
    try {
      return await op();
    } catch (err: any) {
      console.error("[Olympiad Submission Redis] Operation failed:", err.message);
      throw new Error("[Olympiad Redis] Database is currently unavailable.");
    }
  }

  /**
   * Submits the active examination, calculates score, cleans up Redis keys,
   * and creates a 24-hour attempt cooldown in MongoDB.
   * Atomic submission protection implemented.
   */
  public static async submitAttempt(userId: string): Promise<ISubmissionResult> {
    const userActiveKey = this.getUserActiveKey(userId);

    // 1. Fetch active attempt ID
    const attemptId = await this.runRedis(() => redisClient.get(userActiveKey));
    if (!attemptId) {
      throw new Error("No active examination session found.");
    }

    const attemptKey = this.getAttemptKey(attemptId);

    // 2. Fetch session data
    const sessionJson = await this.runRedis(() => redisClient.get(attemptKey));
    if (!sessionJson) {
      // Map exists but session is missing, clean up map and throw
      await this.runRedis(() => redisClient.del(userActiveKey));
      throw new Error("No active examination session found.");
    }

    const session = JSON.parse(sessionJson) as IOlympiadSession;

    // 3. Verify ownership
    if (session.userId !== userId) {
      throw new Error("Unauthorized: You do not own this examination session.");
    }

    // 4. Acquire lock by deleting the active key (atomic operation)
    const lockAcquired = await this.runRedis(() => redisClient.del(userActiveKey));
    if (lockAcquired === 0) {
      throw new Error("Double submission check: This examination has already been submitted.");
    }

    // 5. Delete session attempt data
    await this.runRedis(() => redisClient.del(attemptKey));

    // 6. Calculate score
    let correctAnswersCount = 0;
    let wrongAnswersCount = 0;
    let unansweredCount = 0;

    const bank = QuestionBankService.getInstance();
    const questionsList: any[] = [];

    for (const qId of session.questionOrder) {
      const question = bank.getQuestionById(qId);
      if (!question) {
        // Fallback for unexpected missing questions (e.g. cache reset)
        unansweredCount++;
        continue;
      }

      const answer = session.answers[qId];
      const selectedOption = answer?.selectedOption || null;
      const isCorrect = selectedOption === question.correctOption;

      if (!selectedOption) {
        unansweredCount++;
      } else {
        if (isCorrect) {
          correctAnswersCount++;
        } else {
          wrongAnswersCount++;
        }
      }

      questionsList.push({
        id: qId,
        question: question.question,
        options: question.options,
        selectedOption,
        correctOption: question.correctOption,
        isCorrect,
      });
    }

    const finalScore = correctAnswersCount * 4 + wrongAnswersCount * -1;
    const submittedAt = new Date();

    // 7. Enforce cooldown (MongoDB and Redis cache)
    await CooldownService.createCooldown(userId, submittedAt);

    console.log(
      `[Olympiad Submission] Success: userId=${userId}, attemptId=${attemptId}, score=${finalScore} (Correct=${correctAnswersCount}, Wrong=${wrongAnswersCount}, Unanswered=${unansweredCount})`
    );

    return {
      finalScore,
      correctAnswersCount,
      wrongAnswersCount,
      unansweredCount,
      questions: questionsList,
    };
  }
}
