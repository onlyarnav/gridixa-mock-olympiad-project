import path from "path";

export const olympiadConfig = {
  QUESTION_BANK_VERSION: "v1",
  QUESTIONS_PER_LEVEL: 240,
  QUESTIONS_PER_SET: 60,
  TOTAL_SETS: 4,
  OPTIONS_COUNT: 4,
  QUESTION_BANK_DIR: path.join(__dirname, "../../../question-bank"),
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
} as const;
