import fs from "fs";
import path from "path";
import { AcademicLevel, LEVEL_DIR_MAP } from "../constants/olympiadConstants";
import { IQuestion, IManifest, IQuestionCache, ILevelData } from "../types";
import { olympiadConfig } from "../config/olympiadConfig";
import { validateQuestionBank } from "../validators/questionValidator";

export class QuestionBankService {
  private static instance: QuestionBankService | null = null;
  private cache: IQuestionCache | null = null;

  private constructor() {}

  /**
   * Returns the singleton instance of the service.
   */
  public static getInstance(): QuestionBankService {
    if (!QuestionBankService.instance) {
      QuestionBankService.instance = new QuestionBankService();
    }
    return QuestionBankService.instance;
  }

  /**
   * Loads, validates, and caches the Question Bank in memory.
   * Throws an error if loading or validation fails.
   */
  public initialize(): void {
    console.log("[Olympiad] Question Bank Loading Started...");

    const loadedQuestions = {} as Record<AcademicLevel, IQuestion[]>;
    const loadedManifests = {} as Record<AcademicLevel, IManifest>;

    const version = olympiadConfig.QUESTION_BANK_VERSION;
    const baseDir = olympiadConfig.QUESTION_BANK_DIR;

    for (const level of Object.values(AcademicLevel)) {
      const levelDirName = LEVEL_DIR_MAP[level];
      const levelPath = path.join(baseDir, version, levelDirName);

      const questionsFilePath = path.join(levelPath, "questions.json");
      const manifestFilePath = path.join(levelPath, "manifest.json");

      // Verify files exist
      if (!fs.existsSync(questionsFilePath)) {
        throw new Error(`[Olympiad] Missing questions.json at: "${questionsFilePath}"`);
      }
      if (!fs.existsSync(manifestFilePath)) {
        throw new Error(`[Olympiad] Missing manifest.json at: "${manifestFilePath}"`);
      }

      // Read and parse questions
      try {
        const questionsContent = fs.readFileSync(questionsFilePath, "utf8");
        loadedQuestions[level] = JSON.parse(questionsContent) as IQuestion[];
      } catch (err: any) {
        throw new Error(`[Olympiad] Failed to parse questions.json for ${level}: ${err.message}`);
      }

      // Read and parse manifest
      try {
        const manifestContent = fs.readFileSync(manifestFilePath, "utf8");
        loadedManifests[level] = JSON.parse(manifestContent) as IManifest;
      } catch (err: any) {
        throw new Error(`[Olympiad] Failed to parse manifest.json for ${level}: ${err.message}`);
      }

      console.log(`[Olympiad] Loaded questions and manifests for ${level}...`);
    }

    // Run strict validations
    console.log("[Olympiad] Validating Question Bank...");
    try {
      validateQuestionBank(loadedQuestions, loadedManifests);
    } catch (err: any) {
      console.error(`[Olympiad] Question Bank validation failed: ${err.message}`);
      throw err;
    }
    console.log("[Olympiad] Question Bank validation successful. Cache created.");

    // Build the in-memory cache
    const cacheLevels = {} as Record<AcademicLevel, ILevelData>;
    for (const level of Object.values(AcademicLevel)) {
      cacheLevels[level] = {
        questions: loadedQuestions[level],
        manifest: loadedManifests[level],
      };
    }

    this.cache = { levels: cacheLevels };
    console.log("[Olympiad] Olympiad Module Initialized.");
  }

  /**
   * Returns the cached data for a specific level. Throws error if cache is not initialized.
   */
  private getLevelData(level: AcademicLevel): ILevelData {
    if (!this.cache) {
      throw new Error("[Olympiad] QuestionBankService cache is not initialized.");
    }
    const data = this.cache.levels[level];
    if (!data) {
      throw new Error(`[Olympiad] No cache data found for level: ${level}`);
    }
    return data;
  }

  /**
   * Returns questions list with correctOption stripped (for frontend/API response).
   */
  public getQuestionsForLevel(level: AcademicLevel): Omit<IQuestion, "correctOption">[] {
    const data = this.getLevelData(level);
    return data.questions.map(({ correctOption, ...q }) => q);
  }

  /**
   * Internal method: Returns raw questions list including correct options (backend use only).
   */
  public getQuestionsForLevelInternal(level: AcademicLevel): IQuestion[] {
    const data = this.getLevelData(level);
    return data.questions;
  }

  /**
   * Returns manifest sets for a level.
   */
  public getManifestForLevel(level: AcademicLevel): IManifest {
    const data = this.getLevelData(level);
    return data.manifest;
  }

  /**
   * Retrieves a question by its ID across all levels in the cache.
   */
  public getQuestionById(id: string): IQuestion | undefined {
    if (!this.cache) {
      throw new Error("[Olympiad] QuestionBankService cache is not initialized.");
    }

    for (const level of Object.values(AcademicLevel)) {
      const data = this.cache.levels[level];
      const found = data.questions.find(q => q.id === id);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  /**
   * Validates whether a selected answer is correct.
   */
  public validateAnswer(questionId: string, answerLabel: string): boolean {
    const question = this.getQuestionById(questionId);
    if (!question) {
      throw new Error(`[Olympiad] Question with ID "${questionId}" not found for answer validation.`);
    }
    return question.correctOption === answerLabel;
  }
}
