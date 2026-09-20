// services/olympiad.ts

import { apiRequest } from "@/lib/api";

export interface Option {
  label: string;
  text: string;
}

export interface Question {
  id: string;
  question: string;
  options: Option[];
  difficulty: string;
  subject: string;
}

export interface AnswerPayload {
  selectedOption: string | null;
  answeredAt: string;
}

export interface OlympiadSession {
  attemptId: string;
  userId: string;
  level: string;
  questionBankVersion: string;
  set: string;
  questions: Question[];
  answers: Record<string, AnswerPayload>;
  startedAt: string;
  expiresAt: string;
}

export interface CooldownResponse {
  inCooldown: boolean;
  cooldownUntil: string | null;
}

export interface SubmitResponse {
  finalScore: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  unansweredCount: number;
}

/**
 * Starts a new Olympiad mock examination attempt, or recovers/restores
 * the active one if the user refreshes or re-enters the exam layout.
 */
export async function startOlympiadAttempt(): Promise<{ success: boolean; data: OlympiadSession }> {
  return apiRequest("/olympiad/start", {
    method: "POST",
  });
}

/**
 * Retrieves the currently active examination session for the user, if any.
 * Returns null in the data object if no session is active.
 */
export async function getCurrentOlympiadSession(): Promise<{ success: boolean; data: OlympiadSession | null }> {
  return apiRequest("/olympiad/session", {
    method: "GET",
  });
}

/**
 * Autosaves a student's answer selection.
 * Passing selectedOption = null or empty string clears the answer.
 */
export async function saveOlympiadAnswer(
  questionId: string,
  selectedOption: string | null
): Promise<{ success: boolean; data: { attemptId: string; answers: Record<string, AnswerPayload> } }> {
  return apiRequest("/olympiad/save-answer", {
    method: "POST",
    body: JSON.stringify({ questionId, selectedOption }),
  });
}

/**
 * Submits the active examination attempt and calculates the student's score.
 */
export async function submitOlympiadAttempt(): Promise<{ success: boolean; data: SubmitResponse }> {
  return apiRequest("/olympiad/submit", {
    method: "POST",
  });
}

/**
 * Checks if the student is currently under a 24-hour examination cooldown.
 */
export async function checkOlympiadCooldown(): Promise<{ success: boolean; data: CooldownResponse }> {
  return apiRequest("/olympiad/cooldown", {
    method: "GET",
  });
}
