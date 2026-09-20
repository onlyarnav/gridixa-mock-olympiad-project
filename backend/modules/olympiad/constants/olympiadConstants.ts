export enum AcademicLevel {
  CLASS_4_5 = "CLASS_4_5",
  CLASS_6_8 = "CLASS_6_8",
  CLASS_9_10 = "CLASS_9_10",
  CLASS_11_12 = "CLASS_11_12",
  YEAR_1_2 = "YEAR_1_2",
  YEAR_3_4 = "YEAR_3_4",
}

export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum OptionLabel {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

export const LEVEL_DIR_MAP: Record<AcademicLevel, string> = {
  [AcademicLevel.CLASS_4_5]: "class-4-5",
  [AcademicLevel.CLASS_6_8]: "class-6-8",
  [AcademicLevel.CLASS_9_10]: "class-9-10",
  [AcademicLevel.CLASS_11_12]: "class-11-12",
  [AcademicLevel.YEAR_1_2]: "year-1-2",
  [AcademicLevel.YEAR_3_4]: "year-3-4",
};

export const DB_TO_OLYMPIAD_LEVEL_MAP: Record<string, AcademicLevel> = {
  "4-5": AcademicLevel.CLASS_4_5,
  "6-8": AcademicLevel.CLASS_6_8,
  "9-10": AcademicLevel.CLASS_9_10,
  "11-12": AcademicLevel.CLASS_11_12,
  "1-2": AcademicLevel.YEAR_1_2,
  "3-4": AcademicLevel.YEAR_3_4,
};

/**
 * Maps a database level string to the corresponding AcademicLevel enum.
 * Throws an error if the level is unsupported.
 */
export function mapDbLevelToOlympiad(dbLevel: string): AcademicLevel {
  const mapped = DB_TO_OLYMPIAD_LEVEL_MAP[dbLevel];
  if (!mapped) {
    throw new Error(`Unsupported level: "${dbLevel}"`);
  }
  return mapped;
}
