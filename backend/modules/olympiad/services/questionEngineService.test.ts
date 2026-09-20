import test from "node:test";
import assert from "node:assert";
import { QuestionEngineService } from "./questionEngineService";
import { QuestionBankService } from "./questionBankService";
import { AcademicLevel } from "../constants/olympiadConstants";

test("QuestionEngineService Tests", async (t) => {
  // Ensure QuestionBankService is initialized for sanitization lookup
  QuestionBankService.getInstance().initialize();

  await t.test("should select a random set from set1, set2, set3, set4", () => {
    const selectedSets = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const setKey = QuestionEngineService.selectRandomSet();
      assert.ok(["set1", "set2", "set3", "set4"].includes(setKey));
      selectedSets.add(setKey);
    }
    // With 100 selections, statistical probability dictates we should hit all 4 sets
    assert.strictEqual(selectedSets.size, 4);
  });

  await t.test("should shuffle question IDs to create a permutation", () => {
    const originalIds = Array.from({ length: 60 }, (_, i) => `Q${i}`);
    const shuffledIds = QuestionEngineService.shuffleQuestionIds(originalIds);

    assert.strictEqual(shuffledIds.length, originalIds.length);
    // Sort and verify all original elements are present
    const sortedOriginal = [...originalIds].sort();
    const sortedShuffled = [...shuffledIds].sort();
    assert.deepStrictEqual(sortedShuffled, sortedOriginal);

    // Verify it is actually shuffled (order differs)
    let isDifferent = false;
    for (let i = 0; i < originalIds.length; i++) {
      if (originalIds[i] !== shuffledIds[i]) {
        isDifferent = true;
        break;
      }
    }
    assert.ok(isDifferent);
  });

  await t.test("should retrieve sanitized questions (no correctOption property)", () => {
    const manifest = QuestionBankService.getInstance().getManifestForLevel(AcademicLevel.CLASS_6_8);
    const setIds = manifest.set1;

    const sanitizedQuestions = QuestionEngineService.getSanitizedQuestions(setIds);
    assert.strictEqual(sanitizedQuestions.length, 60);

    for (const q of sanitizedQuestions) {
      assert.strictEqual(q.hasOwnProperty("correctOption"), false);
      assert.ok(q.id);
      assert.ok(q.question);
      assert.ok(q.options);
      assert.strictEqual(q.options.length, 4);
    }
  });

  await t.test("should throw error if invalid question ID is requested for sanitization", () => {
    assert.throws(() => {
      QuestionEngineService.getSanitizedQuestions(["INVALID_ID_9999"]);
    }, /not found in cache/);
  });
});
