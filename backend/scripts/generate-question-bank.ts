import fs from "fs";
import path from "path";

const levels = [
  { dir: "class-4-5", prefix: "CLASS_4_5" },
  { dir: "class-6-8", prefix: "CLASS_6_8" },
  { dir: "class-9-10", prefix: "CLASS_9_10" },
  { dir: "class-11-12", prefix: "CLASS_11_12" },
  { dir: "year-1-2", prefix: "YEAR_1_2" },
  { dir: "year-3-4", prefix: "YEAR_3_4" }
];

const difficulties = ["EASY", "MEDIUM", "HARD"];
const subjects = ["Mathematics", "Science", "Computer Science", "Artificial Intelligence"];
const optionsLabels = ["A", "B", "C", "D"];

const outputDir = path.join(__dirname, "../question-bank/v1");

// Helper to shuffle array (Fisher-Yates)
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

levels.forEach(({ dir, prefix }) => {
  const levelDir = path.join(outputDir, dir);
  if (!fs.existsSync(levelDir)) {
    fs.mkdirSync(levelDir, { recursive: true });
  }

  // Generate exactly 240 questions
  const questions = [];
  const questionIds = [];
  for (let i = 1; i <= 240; i++) {
    const paddedNum = String(i).padStart(3, "0");
    const id = `${prefix}_Q${paddedNum}`;
    questionIds.push(id);

    const question = {
      id,
      question: `This is question ${i} for level ${prefix}. What is the correct answer?`,
      options: optionsLabels.map(label => ({
        label,
        text: `Option ${label} text for question ${id}`
      })),
      correctOption: optionsLabels[Math.floor(Math.random() * 4)],
      difficulty: difficulties[Math.floor(Math.random() * 3)],
      subject: subjects[Math.floor(Math.random() * 4)]
    };
    questions.push(question);
  }

  // Write questions.json
  fs.writeFileSync(
    path.join(levelDir, "questions.json"),
    JSON.stringify(questions, null, 2),
    "utf8"
  );

  // Generate disjoint sets: shuffle the 240 IDs, then slice into 4 sets of 60
  const shuffledIds = shuffle(questionIds);
  const manifest = {
    set1: shuffledIds.slice(0, 60),
    set2: shuffledIds.slice(60, 120),
    set3: shuffledIds.slice(120, 180),
    set4: shuffledIds.slice(180, 240)
  };

  // Write manifest.json
  fs.writeFileSync(
    path.join(levelDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  console.log(`[Mock Question Bank Generator] Generated 240 questions and disjoint manifest sets for ${dir}`);
});

console.log("[Mock Question Bank Generator] Mock Question Bank generation complete!");
