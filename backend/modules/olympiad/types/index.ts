import { AcademicLevel, Difficulty, OptionLabel } from "../constants/olympiadConstants";

export interface IQuestionOption {
  label: OptionLabel;
  text: string;
}

export interface IQuestion {
  id: string;
  question: string;
  options: IQuestionOption[];
  correctOption: OptionLabel;
  difficulty: Difficulty;
  subject: string;
}

export interface IManifest {
  set1: string[];
  set2: string[];
  set3: string[];
  set4: string[];
  [key: string]: string[]; // To allow dynamic access (e.g. manifest["set" + setNumber])
}

export interface ILevelData {
  questions: IQuestion[];
  manifest: IManifest;
}

export interface IQuestionCache {
  levels: Record<AcademicLevel, ILevelData>;
}

export interface IValidationError {
  message: string;
  file?: string;
  level?: AcademicLevel;
}

export interface IOlympiadSession {
  attemptId: string;
  userId: string;
  level: AcademicLevel;
  questionBankVersion: string;
  set: string;
  questionOrder: string[];
  answers: Record<
    string,
    {
      selectedOption: string;
      answeredAt: number;
    }
  >;
  startedAt: number;
  expiresAt: number;
}
