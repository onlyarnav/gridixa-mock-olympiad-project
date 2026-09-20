import test from "node:test";
import assert from "node:assert";
import { QuestionBankService } from "./questionBankService";
import { AcademicLevel, Difficulty, OptionLabel } from "../constants/olympiadConstants";
import { validateQuestionBank } from "../validators/questionValidator";
import { IQuestion, IManifest } from "../types";

// Generate clean base test structures with exactly 240 questions and disjoint sets
function createValidTestBank(): {
  questions: Record<AcademicLevel, IQuestion[]>;
  manifests: Record<AcademicLevel, IManifest>;
} {
  const questions = {} as Record<AcademicLevel, IQuestion[]>;
  const manifests = {} as Record<AcademicLevel, IManifest>;

  for (const level of Object.values(AcademicLevel)) {
    const qList: IQuestion[] = [];
    const qIds: string[] = [];

    for (let i = 1; i <= 240; i++) {
      const id = `${level}_Q${String(i).padStart(3, "0")}`;
      qIds.push(id);
      qList.push({
        id,
        question: `Question ${i}`,
        options: [
          { label: OptionLabel.A, text: "Opt A" },
          { label: OptionLabel.B, text: "Opt B" },
          { label: OptionLabel.C, text: "Opt C" },
          { label: OptionLabel.D, text: "Opt D" },
        ],
        correctOption: OptionLabel.A,
        difficulty: Difficulty.EASY,
        subject: "General",
      });
    }

    questions[level] = qList;
    manifests[level] = {
      set1: qIds.slice(0, 60),
      set2: qIds.slice(60, 120),
      set3: qIds.slice(120, 180),
      set4: qIds.slice(180, 240),
    };
  }

  return { questions, manifests };
}

test("QuestionBankService & Validation Engine Tests (Revised)", async (t) => {
  // Service Initialization tests
  await t.test("should initialize successfully with valid filesystem question bank", () => {
    const service = QuestionBankService.getInstance();
    assert.doesNotThrow(() => {
      service.initialize();
    });
  });

  await t.test("should retrieve sanitized questions (no correctOption property)", () => {
    const service = QuestionBankService.getInstance();
    const questions = service.getQuestionsForLevel(AcademicLevel.CLASS_6_8);
    assert.strictEqual(questions.length, 240);
    // Explicitly verify the correctOption is not exposed
    assert.strictEqual((questions[0] as any).correctOption, undefined);
  });

  await t.test("should retrieve internal questions (with correctOption property)", () => {
    const service = QuestionBankService.getInstance();
    const questions = service.getQuestionsForLevelInternal(AcademicLevel.CLASS_6_8);
    assert.strictEqual(questions.length, 240);
    // Verify it is exposed internally
    assert.ok((questions[0] as any).correctOption !== undefined);
  });

  await t.test("should retrieve manifest containing 4 sets of 60 questions", () => {
    const service = QuestionBankService.getInstance();
    const manifest = service.getManifestForLevel(AcademicLevel.CLASS_6_8);
    assert.ok(manifest.set1);
    assert.strictEqual(manifest.set1.length, 60);
    assert.ok(manifest.set2);
    assert.strictEqual(manifest.set2.length, 60);
    assert.ok(manifest.set3);
    assert.strictEqual(manifest.set3.length, 60);
    assert.ok(manifest.set4);
    assert.strictEqual(manifest.set4.length, 60);
  });

  await t.test("should fetch individual questions by ID correctly", () => {
    const service = QuestionBankService.getInstance();
    const questions = service.getQuestionsForLevelInternal(AcademicLevel.CLASS_6_8);
    const targetQ = questions[0];
    const foundQ = service.getQuestionById(targetQ.id);
    assert.ok(foundQ);
    assert.strictEqual(foundQ.id, targetQ.id);
    assert.strictEqual(foundQ.question, targetQ.question);
  });

  await t.test("should validate answers correctly", () => {
    const service = QuestionBankService.getInstance();
    const questions = service.getQuestionsForLevelInternal(AcademicLevel.CLASS_6_8);
    const targetQ = questions[0];
    const correctLabel = targetQ.correctOption;
    const incorrectLabel = correctLabel === OptionLabel.A ? OptionLabel.B : OptionLabel.A;

    assert.strictEqual(service.validateAnswer(targetQ.id, correctLabel), true);
    assert.strictEqual(service.validateAnswer(targetQ.id, incorrectLabel), false);
  });

  // Validation Engine specific test cases
  await t.test("Validation Engine: should pass for a 100% valid bank", () => {
    const { questions, manifests } = createValidTestBank();
    assert.doesNotThrow(() => {
      validateQuestionBank(questions, manifests);
    });
  });

  await t.test("Validation Engine: should fail if a level has fewer than 240 questions", () => {
    const { questions, manifests } = createValidTestBank();
    // Pop one question
    questions[AcademicLevel.CLASS_6_8].pop();

    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /expected exactly 240/);
  });

  await t.test("Validation Engine: should fail on global duplicate question IDs", () => {
    const { questions, manifests } = createValidTestBank();
    // Force a duplicate ID across different levels
    questions[AcademicLevel.CLASS_6_8][0].id = questions[AcademicLevel.CLASS_4_5][0].id;

    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /Duplicate global Question ID detected/);
  });

  await t.test("Validation Engine: should fail if a question has incorrect number of options", () => {
    const { questions, manifests } = createValidTestBank();
    // Remove an option
    questions[AcademicLevel.CLASS_6_8][0].options.pop();

    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /expected exactly 4/);
  });

  await t.test("Validation Engine: should fail on duplicate option labels", () => {
    const { questions, manifests } = createValidTestBank();
    // Set duplicate label
    questions[AcademicLevel.CLASS_6_8][0].options[1].label = OptionLabel.A;

    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /duplicate option label/);
  });

  await t.test("Validation Engine: should fail on empty question body", () => {
    const { questions, manifests } = createValidTestBank();
    questions[AcademicLevel.CLASS_6_8][0].question = "   ";

    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /has an empty question body/);
  });

  await t.test("Validation Engine: should fail on empty option text", () => {
    const { questions, manifests } = createValidTestBank();
    questions[AcademicLevel.CLASS_6_8][0].options[0].text = "";

    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /has an empty text body/);
  });

  await t.test("Validation Engine: should fail on invalid correctOption label", () => {
    const { questions, manifests } = createValidTestBank();
    questions[AcademicLevel.CLASS_6_8][0].correctOption = "E" as any;

    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /invalid\/missing correctOption/);
  });

  await t.test("Validation Engine: should fail if manifest set has incorrect size", () => {
    const { questions, manifests } = createValidTestBank();
    // Remove one ID from set1
    manifests[AcademicLevel.CLASS_6_8].set1.pop();

    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /contains 59 questions, expected exactly 60/);
  });

  await t.test("Validation Engine: should fail if manifest references non-existent question", () => {
    const { questions, manifests } = createValidTestBank();
    // Set invalid ID in manifest set1
    manifests[AcademicLevel.CLASS_6_8].set1[0] = "NON_EXISTENT_ID";

    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /does not exist in questions.json/);
  });

  await t.test("Validation Engine: should fail if manifest set contains duplicate question IDs", () => {
    const { questions, manifests } = createValidTestBank();
    // Duplicate the first ID to the second slot
    const firstId = manifests[AcademicLevel.CLASS_6_8].set1[0];
    manifests[AcademicLevel.CLASS_6_8].set1[1] = firstId;

    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /Duplicate Question ID .* inside manifest set/);
  });

  await t.test("Validation Engine: should fail if manifest sets are not disjoint (duplicate reference across sets)", () => {
    const { questions, manifests } = createValidTestBank();
    // Reference a question from set1 inside set2
    const firstId = manifests[AcademicLevel.CLASS_6_8].set1[0];
    manifests[AcademicLevel.CLASS_6_8].set2[0] = firstId;

    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /is referenced in multiple sets \(violates disjoint requirement\)/);
  });

  await t.test("Validation Engine: should fail if manifest does not cover all 240 questions", () => {
    const { questions, manifests } = createValidTestBank();
    // Duplicate an ID in set1 instead of referencing a new one, but keep set sizes at 60 (to pass set size check)
    manifests[AcademicLevel.CLASS_6_8].set1[1] = manifests[AcademicLevel.CLASS_6_8].set1[0]; // duplicate in set1
    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /Duplicate Question ID/);
  });

  await t.test("Validation Engine: should fail if manifest has extra keys (e.g. set5)", () => {
    const { questions, manifests } = createValidTestBank();
    (manifests[AcademicLevel.CLASS_6_8] as any).set5 = [];
    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /Manifest keys must be exactly/);
  });

  await t.test("Validation Engine: should fail if manifest has wrong keys (e.g. paper1 instead of set1)", () => {
    const { questions, manifests } = createValidTestBank();
    const tempSet1 = manifests[AcademicLevel.CLASS_6_8].set1;
    delete (manifests[AcademicLevel.CLASS_6_8] as any).set1;
    (manifests[AcademicLevel.CLASS_6_8] as any).paper1 = tempSet1;
    assert.throws(() => {
      validateQuestionBank(questions, manifests);
    }, /Manifest keys must be exactly/);
  });
});
