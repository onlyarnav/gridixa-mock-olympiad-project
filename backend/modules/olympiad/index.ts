import { QuestionBankService } from "./services/questionBankService";

/**
 * Initializes the Olympiad module (loads, validates, and caches questions).
 */
export function initializeOlympiadModule(): void {
  QuestionBankService.getInstance().initialize();
}

export { QuestionBankService };
