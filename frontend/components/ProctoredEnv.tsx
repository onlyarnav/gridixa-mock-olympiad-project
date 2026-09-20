"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, Brain, CheckCircle2, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { getProtectedFile } from "@/services/module";
import { getProgress, submitModuleTest } from "@/services/activity";

export default function ProctoredEnv({ module, onExit }: any) {
  const [stage, setStage] = useState<
    "disclaimer" | "exam" | "result" | "blocked"
  >("disclaimer");
  const [progress, setProgress] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [reviewMarked, setReviewMarked] = useState<boolean[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [focusLostCount, setFocusLostCount] = useState(0);

  const [timeLeft, setTimeLeft] = useState(
    (module.moduleTestDuration || 15) * 60
  );

  const [analysis, setAnalysis] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [analysisIndex, setAnalysisIndex] = useState(0);

  const cumulativeTimeRef = useRef<number[]>([]);
  const questionEnteredAtRef = useRef<number>(0);
  const isSubmittingRef = useRef(false);
  const isBlockedRef = useRef(false);

  const formatTime = (t: number) => {
    const safe = Number.isFinite(t) ? Math.max(0, t) : 0;
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const addCurrentQuestionTime = () => {
    if (stage !== "exam") return;

    const startedAt = questionEnteredAtRef.current;
    if (!startedAt) {
      questionEnteredAtRef.current = Date.now();
      return;
    }

    const elapsedSeconds = Math.max(
      0,
      Math.floor((Date.now() - startedAt) / 1000)
    );

    cumulativeTimeRef.current[current] =
      (cumulativeTimeRef.current[current] || 0) + elapsedSeconds;

    questionEnteredAtRef.current = Date.now();
  };

  const exitExam = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {}
    }
    onExit();
  };

  const blockAttempt = async () => {
    if (isBlockedRef.current) return;
    isBlockedRef.current = true;
    setStage("blocked");

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {}
    }
  };

  const goToQuestion = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= questions.length) return;
    addCurrentQuestionTime();
    setCurrent(nextIndex);
  };

  // Block mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      alert("Use a laptop or desktop to attempt this test.");
      onExit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Try fullscreen early
  useEffect(() => {
    document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  // Strong browser-side shortcut blocking
  useEffect(() => {
    const blockIfNeeded = (e: Event) => {
    const ke = e as KeyboardEvent;

    const key = ke.key?.toLowerCase();

    const blocked =
      key === "f11" ||
      key === "escape" ||
      key === "printscreen" ||
      (ke.ctrlKey && ["c", "v", "x", "s", "p", "u", "r", "t", "n", "w", "l"].includes(key)) ||
      (ke.altKey && ["f4", "tab"].includes(key)) ||
      (ke.metaKey && ["c", "v", "x", "s", "p", "r", "t", "n", "w", "l", "q"].includes(key)) ||
      (ke.shiftKey && ke.ctrlKey && ["i", "j", "c"].includes(key));

    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

    const blockMouse = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const listeners: Array<[string, EventListenerOrEventListenerObject, boolean?]> = [
      ["keydown", blockIfNeeded, true],
      ["keyup", blockIfNeeded, true],
      ["keypress", blockIfNeeded, true],
      ["contextmenu", blockMouse, true],
      ["copy", blockMouse, true],
      ["cut", blockMouse, true],
      ["paste", blockMouse, true],
      ["selectstart", blockMouse, true],
      ["dragstart", blockMouse, true],
    ];

    listeners.forEach(([name, fn, capture]) => {
      document.addEventListener(name, fn as EventListener, capture);
      window.addEventListener(name, fn as EventListener, capture);
    });

    return () => {
      listeners.forEach(([name, fn, capture]) => {
        document.removeEventListener(name, fn as EventListener, capture);
        window.removeEventListener(name, fn as EventListener, capture);
      });
    };
  }, []);

  // Detect tab/window switching, Alt+Tab, app switching, or focus loss
  useEffect(() => {
    const handleBlur = () => {
      if (stage === "exam") {
        const nextCount = focusLostCount + 1;
        setFocusLostCount(nextCount);

        // first loss: warn
        if (nextCount === 1) {
          alert("Focus left the exam window. Returning may cancel the attempt.");
          return;
        }

        // second loss: cancel
        void blockAttempt();
      }
    };

    const handleVisibilityChange = () => {
      if (stage !== "exam") return;

      if (document.hidden) {
        void blockAttempt();
      }
    };

    const handleFullscreenExit = () => {
      if (stage === "exam" && !document.fullscreenElement) {
        void blockAttempt();
      }
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenExit);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
    };
  }, [stage, focusLostCount]);

  // Load questions
  useEffect(() => {
    const load = async () => {

      try {

        if (!module?.moduleTestUrl) {

          throw new Error(
            "Module test unavailable"
          );

        }

        const res = await getProtectedFile(
          module.moduleTestUrl
        );

        if (!res.ok) {

          throw new Error(
            "Failed to load module test"
          );

        }

        const data = await res.json();

        const pool = Array.isArray(data)
          ? data
          : data?.questions || [];

        const shuffled = [...pool]
          .sort(() => 0.5 - Math.random())
          .slice(
            0,
            module.moduleTestQuestions || 30
          );

        setQuestions(shuffled);

        setAnswers(
          new Array(
            shuffled.length
          ).fill(-1)
        );

        setReviewMarked(
          new Array(
            shuffled.length
          ).fill(false)
        );

        cumulativeTimeRef.current =
          new Array(
            shuffled.length
          ).fill(0);

      } catch (err) {

        console.error(err);

        alert(
          "Failed to load questions"
        );

        onExit();

      } finally {

        setLoading(false);

      }

    };

    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);

  // Start timer for current question
  useEffect(() => {
    if (stage === "exam") {
      questionEnteredAtRef.current = Date.now();
    }
  }, [current, stage]);

  // Global timer
  useEffect(() => {
    if (stage !== "exam") return;

    const timer = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const handleAnswer = (index: number) => {
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  };

  const handleToggleReview = () => {
    const updated = [...reviewMarked];
    updated[current] = !updated[current];
    setReviewMarked(updated);
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current || isBlockedRef.current) return;
    isSubmittingRef.current = true;

    addCurrentQuestionTime();

    let correct = 0;

    const analysisData = questions.map((q, i) => {
      const optionList = Array.isArray(q?.options) ? q.options : [];
      const correctIndex = Number.isFinite(Number(q?.correctIndex))
        ? Number(q.correctIndex)
        : 0;
      const userIndex = answers[i] ?? -1;

      const isCorrect = userIndex === correctIndex;
      if (isCorrect) correct++;

      return {
        question: q?.question || "",
        userAnswer: userIndex,
        correctAnswer: correctIndex,
        userOptionText:
          userIndex === -1 || !optionList[userIndex]
            ? "Not Attempted"
            : String(optionList[userIndex]),
        correctOptionText:
          optionList[correctIndex] !== undefined
            ? String(optionList[correctIndex])
            : "N/A",
        timeTaken: Number.isFinite(cumulativeTimeRef.current[i])
          ? cumulativeTimeRef.current[i]
          : 0,
        markedForReview: !!reviewMarked[i],
      };
    });

    const finalScore =
      questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    setScore(Number.isFinite(finalScore) ? finalScore : 0);
    setAnalysis(analysisData);
    setAnalysisIndex(0);

    try {
      await submitModuleTest({
        moduleId: module._id,
        score: Number.isFinite(finalScore) ? finalScore : 0,
        moduleTitle: module.title,
      });

      const updated = await getProgress();
      setProgress(updated);
    } catch (err) {
      console.error("Submit failed", err);
    }

    setStage("result");
    isSubmittingRef.current = false;
  };

  const handleStartTest = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {}
    setFocusLostCount(0);
    setStage("exam");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffbeb] font-mono">
        <h2 className="text-2xl font-black">Loading Exam...</h2>
      </div>
    );
  }

  if (stage === "blocked") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffbeb] p-6 font-mono text-black">
        <div className="w-full max-w-2xl rounded-[2rem] border-[6px] border-black bg-white p-8 text-center shadow-[16px_16px_0px_black] md:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border-4 border-black bg-red-500 px-4 py-2 font-black uppercase text-white">
            <AlertTriangle size={16} />
            Not Allowed
          </div>

          <h2 className="mb-4 text-3xl font-black uppercase md:text-5xl">
            Exam interrupted
          </h2>

          <p className="mb-8 text-base font-bold leading-7 text-black/70 md:text-lg">
            The attempt was cancelled because the exam window lost focus or fullscreen was exited.
          </p>

          <button
            onClick={exitExam}
            className="rounded-[1rem] border-[4px] border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:bg-red-600 md:px-8 md:py-4"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  if (stage === "disclaimer") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffbeb] p-6 font-mono text-black">
        <div className="w-full max-w-3xl rounded-[2rem] border-[6px] border-black bg-white p-8 text-center shadow-[16px_16px_0px_black] md:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border-4 border-black bg-yellow-400 px-4 py-2 font-black uppercase">
            <ShieldCheck size={16} />
            Proctored Exam
          </div>

          <h2 className="mb-6 text-3xl font-black uppercase leading-tight md:text-5xl">
            Exam Instructions
          </h2>

          <div className="space-y-3 rounded-[1.3rem] border-[4px] border-black bg-[#fffbeb] p-5 text-left text-sm font-bold leading-7 md:p-6 md:text-base">
            <div className="flex items-start gap-3 rounded-2xl border-2 border-black bg-white p-3">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-600" />
              <p>Stay in fullscreen throughout the test.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border-2 border-black bg-white p-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
              <p>Leaving fullscreen or switching focus may cancel your attempt.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border-2 border-black bg-white p-3">
              <Clock3 className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
              <p>The timer keeps running continuously.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border-2 border-black bg-white p-3">
              <Brain className="mt-1 h-5 w-5 shrink-0 text-pink-600" />
              <p>Use only this page during the test.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border-2 border-black bg-white p-3">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-purple-600" />
              <p>Use a laptop or desktop for the best experience.</p>
            </div>
          </div>

          <button
            onClick={handleStartTest}
            className="mt-8 rounded-[1rem] border-[4px] border-black bg-yellow-400 px-8 py-4 font-black text-black transition hover:bg-red-500 hover:text-white"
          >
            START TEST
          </button>
        </div>
      </div>
    );
  }

  if (stage === "result") {
    const safeScore = Number.isFinite(score) ? score : 0;
    const correctCount = analysis.filter(
      (a) => a.userAnswer === a.correctAnswer
    ).length;
    const currentAnalysis = analysis[analysisIndex];

    return (
      <div className="min-h-screen bg-[#fffbeb] p-6 font-mono text-black">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 rounded-[2rem] border-[6px] border-black bg-white p-6 shadow-[16px_16px_0px_black] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">Performance review</p>
                <h2 className="text-4xl font-black uppercase md:text-5xl">Result</h2>
              </div>
              <div className="rounded-full border-[4px] border-black bg-yellow-400 px-4 py-2 text-sm font-black">
                {safeScore >= 80 ? "Excellent" : safeScore >= 50 ? "Good Job" : "Needs Practice"}
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="text-7xl font-black text-green-600 animate-pulse md:text-9xl">
                {safeScore}%
              </div>

              <p className="mt-4 text-xl font-bold">
                {safeScore >= 80
                  ? "🔥 Excellent work!"
                  : safeScore >= 50
                  ? "👍 Solid performance!"
                  : "⚠️ A great chance to revise and improve."}
              </p>
            </div>

            <div className="mt-8 h-6 w-full overflow-hidden rounded-full border-[4px] border-black bg-white">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                style={{ width: `${safeScore}%` }}
              />
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.2rem] border-[4px] border-black bg-white p-4 font-bold">
                Total Questions: {questions.length}
              </div>
              <div className="rounded-[1.2rem] border-[4px] border-black bg-white p-4 font-bold">
                Correct: {correctCount}
              </div>
              <div className="rounded-[1.2rem] border-[4px] border-black bg-white p-4 font-bold">
                Wrong: {questions.length - correctCount}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border-[6px] border-black bg-white p-4 shadow-[16px_16px_0px_black] md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-xl font-black uppercase md:text-2xl">Question Analysis</h3>

              <div className="rounded-full border-[4px] border-black bg-yellow-400 px-3 py-2 text-sm font-black">
                {analysisIndex + 1}/{analysis.length || 1}
              </div>
            </div>

            {currentAnalysis ? (
              <div className="space-y-5">
                <div className="rounded-[1.2rem] border-[4px] border-black bg-[#fffbeb] p-4 md:p-5">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-black/60">Question</p>
                  <p className="text-base font-semibold leading-8 md:text-lg">
                    {currentAnalysis.question}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div
                    className={`rounded-[1.2rem] border-[4px] border-black p-4 md:p-5 ${
                      currentAnalysis.userAnswer === currentAnalysis.correctAnswer
                        ? "bg-green-200"
                        : "bg-red-200"
                    }`}
                  >
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.25em]">Your Option</p>
                    <p className="text-base font-bold leading-7 md:text-lg">
                      {currentAnalysis.userOptionText}
                    </p>
                  </div>

                  <div className="rounded-[1.2rem] border-[4px] border-black bg-blue-100 p-4 md:p-5">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.25em]">Correct Option</p>
                    <p className="text-base font-bold leading-7 md:text-lg">
                      {currentAnalysis.correctOptionText}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.2rem] border-[4px] border-black bg-white p-4 font-bold">
                    Time Taken: {formatTime(currentAnalysis.timeTaken)}
                  </div>
                  <div className="rounded-[1.2rem] border-[4px] border-black bg-white p-4 font-bold">
                    Status: {currentAnalysis.userAnswer === currentAnalysis.correctAnswer ? "Correct" : currentAnalysis.userAnswer === -1 ? "Not Attempted" : "Wrong"}
                  </div>
                  <div className="rounded-[1.2rem] border-[4px] border-black bg-white p-4 font-bold">
                    Review: {currentAnalysis.markedForReview ? "Marked" : "No"}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    disabled={analysisIndex === 0}
                    onClick={() => setAnalysisIndex((i) => Math.max(i - 1, 0))}
                    className="rounded-[1rem] border-[4px] border-black bg-yellow-400 px-5 py-3 font-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Prev
                  </button>

                  <div className="flex flex-wrap justify-center gap-2">
                    {analysis.slice(0, 10).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAnalysisIndex(idx)}
                        className={`h-3 w-3 rounded-full border-2 border-black ${
                          analysisIndex === idx ? "bg-black" : "bg-white"
                        }`}
                        aria-label={`Go to analysis ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    disabled={analysisIndex === analysis.length - 1}
                    onClick={() => setAnalysisIndex((i) => Math.min(i + 1, analysis.length - 1))}
                    className="rounded-[1rem] border-[4px] border-black bg-yellow-400 px-5 py-3 font-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-bold">No analysis available.</p>
            )}
          </div>

          <button
            onClick={exitExam}
            className="mt-8 rounded-[1rem] border-[4px] border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:bg-red-600 md:px-8 md:py-4"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fffbeb] font-mono text-black">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 rounded-[2rem] border-[6px] border-black bg-white p-6 shadow-[12px_12px_0px_black]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/60">Question {current + 1}/{questions.length}</p>
              <h2 className="text-2xl font-black uppercase md:text-3xl">{module?.title}</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border-[4px] border-black bg-yellow-400 px-4 py-2 text-sm font-black">
              <Clock3 size={16} />
              {formatTime(timeLeft)}
            </div>
          </div>

          <p className="mt-6 text-lg font-semibold leading-8 md:text-xl">
            {questions[current]?.question}
          </p>
        </div>

        <div className="space-y-3">
          {questions[current]?.options?.map((opt: any, i: number) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`block w-full rounded-[1.2rem] border-[4px] border-black p-4 text-left font-bold transition ${
                answers[current] === i
                  ? "bg-green-200"
                  : "bg-white hover:bg-yellow-100"
              }`}
            >
              <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-yellow-300 text-sm font-black">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            disabled={current === 0}
            onClick={() => goToQuestion(current - 1)}
            className="rounded-[1rem] border-[4px] border-black bg-yellow-500 px-6 py-3 font-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Prev
          </button>

          <button
            onClick={handleToggleReview}
            className={`rounded-[1rem] border-[4px] border-black px-6 py-3 font-black transition ${
              reviewMarked[current]
                ? "bg-purple-400 hover:bg-purple-300"
                : "bg-white hover:bg-purple-100"
            }`}
          >
            {reviewMarked[current] ? "Unmark Review" : "Mark for Review"}
          </button>

          <button
            disabled={current === questions.length - 1}
            onClick={() => goToQuestion(current + 1)}
            className="rounded-[1rem] border-[4px] border-black bg-yellow-500 px-6 py-3 font-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 rounded-[1rem] border-[4px] border-black bg-red-500 px-6 py-3 font-black text-white transition hover:bg-red-600"
        >
          Submit Test
        </button>
      </div>

      <div className="w-72 border-l-[4px] border-black bg-white p-4">
        <div className="grid grid-cols-5 gap-2">
          {answers.map((a, i) => {
            const isReview = reviewMarked[i];
            const isCurrent = current === i;
            const isAnswered = a !== -1;

            let bgClass = "bg-gray-200";
            if (isAnswered && isReview) bgClass = "bg-amber-300";
            else if (isReview) bgClass = "bg-purple-200";
            else if (isAnswered) bgClass = "bg-green-300";

            return (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                className={`rounded-xl border-2 border-black p-2 text-xs font-black ${bgClass} ${
                  isCurrent ? "ring-4 ring-black" : ""
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-[1.2rem] border-[4px] border-black bg-[#fffbeb] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/60">Exam tracker</p>
          <div className="mt-3 text-3xl font-black">{formatTime(timeLeft)}</div>
        </div>

        <div className="mt-4 space-y-2 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded border border-black bg-gray-200" />
            Not attempted
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded border border-black bg-green-300" />
            Answered
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded border border-black bg-purple-200" />
            Marked for review
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded border border-black bg-amber-300" />
            Answered + review
          </div>
        </div>

        <button
          onClick={exitExam}
          className="mt-6 w-full rounded-[1rem] border-[4px] border-black bg-black px-4 py-3 font-black text-white transition hover:bg-red-600"
        >
          Exit
        </button>
      </div>
    </div>
  );
}