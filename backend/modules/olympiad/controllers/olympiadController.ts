import { Request, Response } from "express";
import { AttemptService } from "../services/attemptService";
import { QuestionEngineService } from "../services/questionEngineService";
import { OptionLabel } from "../constants/olympiadConstants";
import { SubmissionService } from "../services/submissionService";
import { CooldownService } from "../services/cooldownService";

export class OlympiadController {
  /**
   * Starts a new examination or recovers the existing active one.
   * POST /api/olympiad/start
   */
  public static async startAttempt(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id?.toString();
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Missing authenticated user context.",
        });
      }

      const session = await AttemptService.getOrCreateSession(userId);
      const sanitizedQuestions = QuestionEngineService.getSanitizedQuestions(
        session.questionOrder
      );

      return res.status(200).json({
        success: true,
        data: {
          attemptId: session.attemptId,
          level: session.level,
          set: session.set,
          startedAt: session.startedAt,
          expiresAt: session.expiresAt,
          questions: sanitizedQuestions,
          answers: session.answers,
        },
      });
    } catch (err: any) {
      console.error("[Olympiad Controller] startAttempt Error:", err.message);

      const isValidationError =
        err.message.includes("User academic level not defined") ||
        err.message.includes("Unsupported level") ||
        err.message.includes("User not found") ||
        err.message.includes("Cooldown is active");

      return res.status(isValidationError ? 400 : 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * Recovers the current active examination session if present.
   * GET /api/olympiad/session
   */
  public static async getCurrentSession(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id?.toString();
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Missing authenticated user context.",
        });
      }

      const session = await AttemptService.getActiveSession(userId);
      if (!session) {
        return res.status(200).json({
          success: true,
          data: null,
        });
      }

      const sanitizedQuestions = QuestionEngineService.getSanitizedQuestions(
        session.questionOrder
      );

      return res.status(200).json({
        success: true,
        data: {
          attemptId: session.attemptId,
          level: session.level,
          set: session.set,
          startedAt: session.startedAt,
          expiresAt: session.expiresAt,
          questions: sanitizedQuestions,
          answers: session.answers,
        },
      });
    } catch (err: any) {
      console.error("[Olympiad Controller] getCurrentSession Error:", err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * Autosaves a student's answer choice for a specific question.
   * POST /api/olympiad/save-answer
   */
  public static async saveAnswer(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id?.toString();
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Missing authenticated user context.",
        });
      }

      const { questionId, selectedOption } = req.body;

      // Validation check
      if (!questionId || typeof questionId !== "string" || questionId.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Validation Error: questionId parameter is required and must be a string.",
        });
      }

      // If selectedOption is provided, check if it's correct type
      if (selectedOption !== undefined && selectedOption !== null && selectedOption !== "") {
        const validOptions = Object.values(OptionLabel) as string[];
        if (!validOptions.includes(selectedOption)) {
          return res.status(400).json({
            success: false,
            message: `Validation Error: Invalid option label "${selectedOption}". Must be A, B, C, or D.`,
          });
        }
      }

      await AttemptService.saveAnswer(
        userId,
        questionId.trim(),
        selectedOption === "" ? null : selectedOption
      );

      return res.status(200).json({
        success: true,
        message: "Answer saved successfully.",
      });
    } catch (err: any) {
      console.error("[Olympiad Controller] saveAnswer Error:", err.message);

      const isClientError =
        err.message.includes("No active examination session found") ||
        err.message.includes("session has expired") ||
        err.message.includes("does not belong to your examination set") ||
        err.message.includes("Unauthorized");

      return res.status(isClientError ? 400 : 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * Returns remaining seconds for the active session.
   * GET /api/olympiad/remaining-time
   */
  public static async getRemainingTime(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id?.toString();
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Missing authenticated user context.",
        });
      }

      const session = await AttemptService.getActiveSession(userId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: "No active examination session found.",
        });
      }

      const remainingSeconds = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));

      return res.status(200).json({
        success: true,
        data: {
          remainingSeconds,
        },
      });
    } catch (err: any) {
      console.error("[Olympiad Controller] getRemainingTime Error:", err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * Submits the user's active mock examination, returns score, and triggers cooldown.
   * POST /api/olympiad/submit
   */
  public static async submitAttempt(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id?.toString();
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Missing authenticated user context.",
        });
      }

      const result = await SubmissionService.submitAttempt(userId);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      console.error("[Olympiad Controller] submitAttempt Error:", err.message);

      const isClientError =
        err.message.includes("No active examination session found") ||
        err.message.includes("already been submitted") ||
        err.message.includes("Unauthorized");

      return res.status(isClientError ? 400 : 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * Checks the current cooldown status for a user.
   * GET /api/olympiad/cooldown
   */
  public static async checkCooldown(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id?.toString();
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Missing authenticated user context.",
        });
      }

      const cooldownStatus = await CooldownService.isUserInCooldown(userId);

      return res.status(200).json({
        success: true,
        data: cooldownStatus,
      });
    } catch (err: any) {
      console.error("[Olympiad Controller] checkCooldown Error:", err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
