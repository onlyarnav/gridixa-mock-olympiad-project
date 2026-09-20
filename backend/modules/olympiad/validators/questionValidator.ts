import { AcademicLevel, Difficulty, OptionLabel } from "../constants/olympiadConstants";
import { IQuestion, IManifest } from "../types";
import { olympiadConfig } from "../config/olympiadConfig";

/**
 * Validates the loaded questions and manifests for all academic levels.
 * Throws an Error if any validation check fails.
 */
export function validateQuestionBank(
  allQuestions: Record<AcademicLevel, IQuestion[]>,
  allManifests: Record<AcademicLevel, IManifest>
): void {
  const globalQuestionIds = new Set<string>();

  for (const level of Object.values(AcademicLevel)) {
    const questions = allQuestions[level];
    const manifest = allManifests[level];

    if (!questions) {
      throw new Error(`[Olympiad Validation] Missing questions list for level: ${level}`);
    }
    if (!manifest) {
      throw new Error(`[Olympiad Validation] Missing manifest for level: ${level}`);
    }

    // 1. Enforce exact question bank size (240 questions per level)
    if (questions.length !== olympiadConfig.QUESTIONS_PER_LEVEL) {
      throw new Error(
        `[Olympiad Validation] Level ${level}: Contains ${questions.length} questions, expected exactly ${olympiadConfig.QUESTIONS_PER_LEVEL}`
      );
    }

    // Map to lookup questions by ID within the level
    const levelQuestionsMap = new Map<string, IQuestion>();

    // 2. Validate individual questions
    questions.forEach((q, idx) => {
      // Check ID
      if (!q.id || typeof q.id !== "string" || q.id.trim() === "") {
        throw new Error(`[Olympiad Validation] Level ${level}: Question at index ${idx} is missing a valid ID`);
      }

      const id = q.id.trim();

      // Check for global duplicates
      if (globalQuestionIds.has(id)) {
        throw new Error(`[Olympiad Validation] Duplicate global Question ID detected: "${id}"`);
      }
      globalQuestionIds.add(id);
      levelQuestionsMap.set(id, q);

      // Check question text
      if (!q.question || typeof q.question !== "string" || q.question.trim() === "") {
        throw new Error(`[Olympiad Validation] Level ${level}: Question "${id}" has an empty question body`);
      }

      // Check options count
      if (!Array.isArray(q.options) || q.options.length !== olympiadConfig.OPTIONS_COUNT) {
        throw new Error(
          `[Olympiad Validation] Level ${level}: Question "${id}" has ${
            q.options?.length ?? 0
          } options, expected exactly ${olympiadConfig.OPTIONS_COUNT}`
        );
      }

      // Validate options labels and content
      const uniqueLabels = new Set<OptionLabel>();
      q.options.forEach((opt, optIdx) => {
        if (!opt.label || !Object.values(OptionLabel).includes(opt.label)) {
          throw new Error(
            `[Olympiad Validation] Level ${level}: Question "${id}" has an invalid option label "${
              opt.label
            }" at index ${optIdx}`
          );
        }
        if (uniqueLabels.has(opt.label)) {
          throw new Error(
            `[Olympiad Validation] Level ${level}: Question "${id}" has duplicate option label "${opt.label}"`
          );
        }
        uniqueLabels.add(opt.label);

        if (!opt.text || typeof opt.text !== "string" || opt.text.trim() === "") {
          throw new Error(
            `[Olympiad Validation] Level ${level}: Question "${id}", option "${opt.label}" has an empty text body`
          );
        }
      });

      // Validate correctOption
      if (!q.correctOption || !Object.values(OptionLabel).includes(q.correctOption)) {
        throw new Error(
          `[Olympiad Validation] Level ${level}: Question "${id}" has an invalid/missing correctOption "${q.correctOption}"`
        );
      }
      if (!uniqueLabels.has(q.correctOption)) {
        throw new Error(
          `[Olympiad Validation] Level ${level}: Question "${id}" has correctOption "${q.correctOption}" which is not defined in options`
        );
      }

      // Validate difficulty
      if (!q.difficulty || !Object.values(Difficulty).includes(q.difficulty)) {
        throw new Error(
          `[Olympiad Validation] Level ${level}: Question "${id}" has an invalid/missing difficulty "${q.difficulty}"`
        );
      }

      // Validate subject
      if (!q.subject || typeof q.subject !== "string" || q.subject.trim() === "") {
        throw new Error(
          `[Olympiad Validation] Level ${level}: Question "${id}" has an empty or invalid subject`
        );
      }
    });

    // 3. Validate manifest sets (Exactly 4 disjoint sets of 60 questions covering all 240 questions)
    const manifestSets = ["set1", "set2", "set3", "set4"];
    const allReferencedIds = new Set<string>();

    // Verify manifest has exactly set1, set2, set3, set4 and no other keys
    const manifestKeys = Object.keys(manifest);
    const hasUnexpectedKeys = manifestKeys.some(key => !manifestSets.includes(key));
    const hasMissingKeys = manifestSets.some(key => !manifestKeys.includes(key));

    if (hasUnexpectedKeys || hasMissingKeys || manifestKeys.length !== manifestSets.length) {
      throw new Error(
        `[Olympiad Validation] Level ${level}: Manifest keys must be exactly ["set1", "set2", "set3", "set4"], got [${manifestKeys.join(", ")}]`
      );
    }

    manifestSets.forEach(setName => {
      const set = manifest[setName];
      if (!Array.isArray(set)) {
        throw new Error(`[Olympiad Validation] Level ${level}: Manifest is missing set "${setName}" or it is not an array`);
      }

      // Check size (exactly 60 questions per set)
      if (set.length !== olympiadConfig.QUESTIONS_PER_SET) {
        throw new Error(
          `[Olympiad Validation] Level ${level}: Manifest set "${setName}" contains ${set.length} questions, expected exactly ${olympiadConfig.QUESTIONS_PER_SET}`
        );
      }

      // Check for duplicates inside set and verify referenced questions exist
      const uniqueSetIds = new Set<string>();
      set.forEach((qId, qIdx) => {
        if (!qId || typeof qId !== "string" || qId.trim() === "") {
          throw new Error(
            `[Olympiad Validation] Level ${level}: Manifest set "${setName}" contains an empty question ID at index ${qIdx}`
          );
        }

        const cleanQId = qId.trim();

        if (uniqueSetIds.has(cleanQId)) {
          throw new Error(
            `[Olympiad Validation] Level ${level}: Duplicate Question ID "${cleanQId}" inside manifest set "${setName}"`
          );
        }
        uniqueSetIds.add(cleanQId);

        // Verify question exists in the loaded level questions
        if (!levelQuestionsMap.has(cleanQId)) {
          throw new Error(
            `[Olympiad Validation] Level ${level}: Question ID "${cleanQId}" referenced in manifest set "${setName}" does not exist in questions.json`
          );
        }

        // Verify disjoint partitioning (no ID referenced in multiple sets)
        if (allReferencedIds.has(cleanQId)) {
          throw new Error(
            `[Olympiad Validation] Level ${level}: Question ID "${cleanQId}" is referenced in multiple sets (violates disjoint requirement)`
          );
        }
        allReferencedIds.add(cleanQId);
      });
    });

    // Verify collective coverage of all 240 questions
    if (allReferencedIds.size !== olympiadConfig.QUESTIONS_PER_LEVEL) {
      throw new Error(
        `[Olympiad Validation] Level ${level}: Manifest sets collectively cover ${allReferencedIds.size} unique questions, expected exactly ${olympiadConfig.QUESTIONS_PER_LEVEL}`
      );
    }
  }
}
