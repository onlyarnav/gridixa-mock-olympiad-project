import { AcademicLevel } from "../constants/olympiadConstants";
import { IQuestion } from "../types";
import { QuestionBankService } from "./questionBankService";

export class QuestionEngineService {
  /**
   * Randomly selects one of the 4 predefined sets from the manifest: set1, set2, set3, set4.
   */
  public static selectRandomSet(): "set1" | "set2" | "set3" | "set4" {
    const sets = ["set1", "set2", "set3", "set4"] as const;
    const randomIndex = Math.floor(Math.random() * 4);
    return sets[randomIndex];
  }

  /**
   * Shuffles the order of the sixty questions using the Fisher-Yates algorithm.
   */
  public static shuffleQuestionIds(ids: string[]): string[] {
    const shuffled = [...ids];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  }

  /**
   * Resolves question details for a list of question IDs in the specified order,
   * and removes the sensitive fields (correctOption) before returning.
   */
  public static getSanitizedQuestions(
    questionIds: string[]
  ): Omit<IQuestion, "correctOption">[] {
    const questionBank = QuestionBankService.getInstance();
    const sanitizedList: Omit<IQuestion, "correctOption">[] = [];

    for (const id of questionIds) {
      const question = questionBank.getQuestionById(id);
      if (!question) {
        throw new Error(`[Olympiad Engine] Question ID "${id}" not found in cache.`);
      }
      
      // Strip correctOption
      const { correctOption, ...sanitized } = question;
      sanitizedList.push(sanitized);
    }

    return sanitizedList;
  }
}
