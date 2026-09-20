"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { createPortal } from "react-dom";

import { ArrowLeft, ArrowRight, ArrowUp, BookOpen, Brain, CheckCircle2, Compass, Lock, Sparkles, X } from "lucide-react";

import { getModules, getProtectedFile } from "@/services/module";
import {
  logActivity,
  markTopicComplete,
  markChapterPractice,
  getProgress,
} from "@/services/activity";

import { useAuth } from "@/context/AuthContext";

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  raw?: any;
};

function shuffleArray<T>(items: T[]) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i]!, arr[j]!] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function normalizeQuestion(raw: any): QuizQuestion | null {
  const question =
    raw?.question ?? raw?.q ?? raw?.prompt ?? raw?.title ?? raw?.text;

  if (!question) return null;

  let options: string[] = [];
  const sourceOptions =
    raw?.options ?? raw?.choices ?? raw?.answers ?? raw?.mcqOptions;

  if (Array.isArray(sourceOptions)) {
    options = sourceOptions.map((opt) => String(opt));
  } else if (sourceOptions && typeof sourceOptions === "object") {
    options = Object.values(sourceOptions).map((opt) => String(opt));
  }

  if (options.length < 4) {
    const fallback = [raw?.option1, raw?.option2, raw?.option3, raw?.option4]
      .filter(Boolean)
      .map(String);
    if (fallback.length) options = fallback;
  }

  if (options.length < 4) return null;
  options = options.slice(0, 4);

  const correctRaw =
    raw?.correctAnswer ??
    raw?.correctIndex ??
    raw?.answerIndex ??
    raw?.correct_answer ??
    raw?.answer ??
    raw?.correct;

  let correctIndex = -1;

  if (typeof correctRaw === "number") {
    correctIndex = correctRaw;
  } else if (typeof correctRaw === "string") {
    const normalized = correctRaw.trim();

    if (/^\d+$/.test(normalized)) {
      correctIndex = Number(normalized);
    } else if (/^[ABCD]$/i.test(normalized)) {
      correctIndex = normalized.toUpperCase().charCodeAt(0) - 65;
    } else {
      correctIndex = options.findIndex(
        (opt) => opt.trim().toLowerCase() === normalized.toLowerCase()
      );
    }
  }

  if (correctIndex < 0 || correctIndex > 3) {
    correctIndex = 0;
  }

  const indexedOptions = options.map((option, index) => ({
    option,
    originalIndex: index,
  }));

  const shuffled = shuffleArray(indexedOptions);

  const shuffledOptions = shuffled.map((item) => item.option);

  const newCorrectIndex = shuffled.findIndex(
    (item) => item.originalIndex === correctIndex
  );

  return {
    question: String(question),
    options: shuffledOptions,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
    raw,
  };
}

function pickFiveQuestions(rawQuestions: any[]): QuizQuestion[] {
  const normalized = rawQuestions
    .map(normalizeQuestion)
    .filter(Boolean) as QuizQuestion[];

  return shuffleArray(normalized).slice(0, 5);
}

function ChapterTestModal({
  isOpen,
  onClose,
  chapterTitle,
  practiceUrl,
  onComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  chapterTitle: string;
  practiceUrl?: string;
  onComplete: () => Promise<void>;
}) {
  const [stage, setStage] = useState<"disclaimer" | "quiz" | "result">(
    "disclaimer"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(40);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const scoreRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const answerLockRef = useRef(false);

  const [mounted, setMounted] = useState(false);

  const resetTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const closeAndReset = () => {
    resetTimer();
    setStage("disclaimer");
    setLoading(false);
    setError("");
    setQuestions([]);
    setCurrentIndex(0);
    setSecondsLeft(40);
    setScore(0);
    setSelectedIndex(null);
    setLocked(false);
    scoreRef.current = 0;
    answerLockRef.current = false;
    onClose();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setStage("disclaimer");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const loadQuestions = async () => {
      setLoading(true);
      setError("");
      setStage("disclaimer");
      setQuestions([]);
      setCurrentIndex(0);
      setSecondsLeft(40);
      setScore(0);
      setSelectedIndex(null);
      setLocked(false);
      scoreRef.current = 0;
      answerLockRef.current = false;

      try {
        if (!practiceUrl) {
          throw new Error("Practice questions are not available yet.");
        }

        const res = await getProtectedFile(
          practiceUrl
        );
        
        if (!res.ok) {
          throw new Error("Practice questions unavailable.");
        }

        const data = await res.json();

        const pool = Array.isArray(data)
          ? data
          : Array.isArray(data?.questions)
          ? data.questions
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const selected = pickFiveQuestions(pool);

        if (selected.length < 5) {
          throw new Error(
            "Not enough valid MCQ questions found in practice content."
          );
        }

        setQuestions(selected);
      } catch (err: any) {
        setError(err?.message || "Failed to load practice test.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [isOpen, practiceUrl]);

  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || stage !== "quiz") return;

    resetTimer();
    setSecondsLeft(40);
    setSelectedIndex(null);
    setLocked(false);
    answerLockRef.current = false;

    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          resetTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => resetTimer();
  }, [isOpen, stage, currentIndex]);

  const finishQuestion = async (isCorrect: boolean) => {
    if (answerLockRef.current) return;
    answerLockRef.current = true;
    setLocked(true);
    resetTimer();

    const nextScore = scoreRef.current + (isCorrect ? 1 : 0);
    scoreRef.current = nextScore;
    setScore(nextScore);

    window.setTimeout(async () => {
      const isLast = currentIndex >= questions.length - 1;

      if (!isLast) {
        answerLockRef.current = false;
        setCurrentIndex((prev) => prev + 1);
        setSelectedIndex(null);
        setLocked(false);
        setSecondsLeft(40);
        return;
      }

      setStage("result");
      try {
        await onComplete();
      } catch (err) {
        console.error("Failed to update progress", err);
      }
    }, 500);
  };

  useEffect(() => {
    if (!isOpen || stage !== "quiz") return;
    if (secondsLeft === 0 && !answerLockRef.current) {
      finishQuestion(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isOpen, stage]);

  const handleOptionClick = (index: number) => {
    if (locked || stage !== "quiz") return;
    setSelectedIndex(index);
    finishQuestion(index === questions[currentIndex]?.correctIndex);
  };

  const currentQuestion = questions[currentIndex];
  const percent = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 py-6 font-mono text-black">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-black bg-white shadow-[12px_12px_0px_black]">
      <button
          onClick={closeAndReset}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center border-2 border-black bg-white font-black text-black hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="border-b-4 border-black bg-yellow-300 px-6 py-4 pr-14">
          <h3 className="text-2xl font-black text-black uppercase">Chapter Test</h3>
          <p className="text-sm font-bold">
            {chapterTitle}
          </p>
        </div>

        <div className="p-6 md:p-8">
          {loading ? (
            <div className="animate-pulse border-4 border-black p-10 text-center font-black">
              Preparing your test...
            </div>
          ) : error ? (
            <div className="border-4 border-black bg-red-100 p-6">
              <p className="font-black text-red-700">{error}</p>
              <button
                onClick={closeAndReset}
                className="mt-4 border-4 border-black bg-white px-5 py-3 font-black"
              >
                Close
              </button>
            </div>
          ) : stage === "disclaimer" ? (
            <div className="space-y-6">
              <div className="border-4 border-black bg-gray-50 p-5">
                <p className="text-base md:text-lg font-semibold leading-8 text-gray-800">
                  This chapter test contains <strong>5 random MCQs</strong> selected from the practice bank.
                  You will get <strong>40 seconds</strong> for each question.
                  Once you select an answer, or time runs out, the next question will appear automatically.
                </p>
              </div>

              <div className="border-4 border-black bg-white p-5">
                <p className="font-black text-black uppercase tracking-wide mb-2">Test rules</p>
                <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-gray-800">
                  <li>No marks are stored here; only your live score will be shown.</li>
                  <li>You cannot go back to a previous question.</li>
                  <li>Keep an eye on the timer for every question.</li>
                </ul>
              </div>

              <button
                onClick={() => setStage("quiz")}
                className="inline-flex text-black items-center gap-2 border-4 border-black bg-yellow-400 px-6 py-3 font-black hover:bg-yellow-300"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          ) : stage === "result" ? (
            <div className="space-y-6 text-black text-center">
              <div className="border-4 border-black bg-green-100 p-8">
                <h4 className="text-3xl font-black text-black mb-3">Test Completed</h4>
                <p className="text-lg font-bold text-black">
                  You scored <span className="text-2xl">{score}/{questions.length}</span>
                </p>
                <p className="mt-2 text-base font-semibold text-black">
                  Performance: <span className="font-black">{percent}%</span>
                </p>
              </div>

              <button
                onClick={closeAndReset}
                className="inline-flex items-center gap-2 border-4 border-black bg-yellow-400 px-6 py-3 font-black hover:bg-yellow-300 text-black"
              >
                Close Test
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col text-black gap-3 border-4 border-black bg-white p-4 md:flex-row md:items-center md:justify-between">
                <div className="font-black test-black uppercase">
                  Question {currentIndex + 1} / {questions.length}
                </div>
                <div className="text-sm font-black text-black">
                  Score: {score}/{questions.length}
                </div>
                <div className="text-sm font-black text-black">
                  Time Left: <span className="text-red-600">{secondsLeft}s</span>
                </div>
              </div>

              <div className="border-4 border-black bg-gray-50 p-5 md:p-7">
                <p className="text-lg md:text-xl font-bold leading-relaxed text-black">
                  {currentQuestion?.question}
                </p>
              </div>

              <div className="grid gap-4">
                {currentQuestion?.options?.map((option, index) => {
                  const isSelected = selectedIndex === index;
                  const isCorrect = currentQuestion.correctIndex === index;

                  let optionClass = "bg-white hover:bg-blue-50";
                  if (locked && isCorrect) optionClass = "bg-green-200";
                  if (locked && isSelected && !isCorrect) optionClass = "bg-red-200";

                  return (
                    <button
                      key={`${currentIndex}-${index}`}
                      onClick={() => handleOptionClick(index)}
                      disabled={locked}
                      className={`border-4 border-black px-5 py-4 text-left font-bold transition disabled:cursor-not-allowed ${optionClass}`}
                    >
                      <span className="mr-3 inline-flex h-7 w-7 text-black items-center justify-center border-2 border-black bg-yellow-300 text-sm font-black">
                        {String.fromCharCode(65 + index)}
                      </span>
                      < span className="text-black"> {option} </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-semibold text-gray-700">
                  The next question will load automatically after your answer or timeout.
                </div>
                <div className="text-xs font-black uppercase tracking-wide bg-yellow-300 border-2 border-black px-3 py-2 text-black">
                  Olympiad Mode
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>, 
  document.body);
}

export default function StudentModules({ onActivity }: { onActivity?: () => void }) {
  const { user } = useAuth();
  const isAdminUser = user?.email?.toLowerCase() === "ayushmh75@gmail.com";

  const [modules, setModules] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<any>({
    "4-5": [],
    "6-8": [],
    "9-10": [],
    "11-12": [],
    "1-2": [],
    "3-4": [],
  });
  const [progress, setProgress] = useState<any>(null);
  const [scrollDirection, setScrollDirection] = useState<"top" | "bottom">("bottom");

  const [activeModule, setActiveModule] = useState<any>(null);
  const [activeChapter, setActiveChapter] = useState<any>(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState<number | null>(null);

  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const levelMap: Record<string, string> = {
    "4-5": "1",
    "6-8": "2",
    "9-10": "3",
    "11-12": "4",
    "1-2": "5",
    "3-4": "6",
  };

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollTop > maxScroll / 2) {
        setScrollDirection("top"); // show ↑
      } else {
        setScrollDirection("bottom"); // show ↓
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FETCH MODULES + PROGRESS
  useEffect(() => {
    const init = async () => {
      try {
        const [modulesData, progressData] = await Promise.all([
          getModules(),
          getProgress(),
        ]);

        const groupedData: Record<string, any[]> = {
          "4-5": [],
          "6-8": [],
          "9-10": [],
          "11-12": [],
          "1-2": [],
          "3-4": [],
        };

        modulesData.forEach((m: any) => {
          if (groupedData[m.level]) {
            groupedData[m.level]!.push(m);
          }
        });

        setModules(modulesData);
        setGrouped(groupedData);
        setProgress(progressData);
      } catch (error) {
        console.error("Init failed", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const isModuleUnlocked = (module: any) => {

    // 🔓 Special bypass user
    if (isAdminUser) {
      return true;
    }

    const moduleProgress = progress?.modules?.find(
      (m: any) => m.moduleId?.toString() === module._id?.toString()
    );

    return !!moduleProgress?.unlocked;
  };

  const getModuleProgress = (moduleId: string) =>
    progress?.modules?.find(
      (m: any) => m.moduleId?.toString() === moduleId?.toString()
    );

  const getChapterProgress = (moduleId: string, chapterId: string) => {
    const module = getModuleProgress(moduleId);

    if (!module) return null;

    return module.chapters?.find(
      (c: any) => c.chapterId?.toString() === chapterId?.toString()
    ) || null;
  };

  const getTopicProgress = (moduleId: string, chapterId: string, topicId: string) =>
    getChapterProgress(moduleId, chapterId)?.topics?.find(
      (t: any) => t.topicId?.toString() === topicId?.toString()
    );

  const renderBreadcrumb = () => {
    if (!activeModule) return null;

    const levelLabel = levelMap[activeModule.level]
      ? `Level ${levelMap[activeModule.level]}`
      : activeModule.level;

    return (
      <div className="flex justify-end mb-4">
        <div className="text-xs md:text-sm font-black uppercase bg-yellow-400 text-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_black]">
          {levelLabel} → {activeModule.title}
          {activeChapter && <> → {activeChapter.title}</>}
          {activeChapter && activeTopicIndex !== null && (
            <> → {activeChapter.topics[activeTopicIndex]?.title}</>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeModule, activeChapter, activeTopicIndex]);

  const loadTopic = async (topic: any) => {
    setContentLoading(true);

    try {

      if (!topic?.notePath) {

        setMarkdown(
          "## ⏳ Waiting for the notes.\nCome back later."
        );

        return;
      }

      const res = await getProtectedFile(
        topic.notePath
      );

      if (!res.ok) {

        throw new Error(
          "Notes not found"
        );

      }

      const text = await res.text();

      if (text.startsWith("<!DOCTYPE")) {
        setMarkdown("## ⚠️ Notes not available yet.");
        return;
      }

      setMarkdown(text);
      await logActivity();
      onActivity?.(); 
    } catch {
      setMarkdown("## ⚠️ Failed to load content.");
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    if (activeChapter && activeTopicIndex !== null) {
      const topic = activeChapter.topics?.[activeTopicIndex];
      if (topic) loadTopic(topic);
    }
  }, [activeChapter, activeTopicIndex]);

  const handleNext = async () => {
    if (!activeModule || !activeChapter || activeTopicIndex === null) return;

    const topic = activeChapter.topics?.[activeTopicIndex];
    if (!topic) return;

    try {
      // ✅ STEP 1: mark topic complete
      await markTopicComplete(
        activeModule._id,
        activeChapter.chapterKey,
        topic._id
      );

      // ✅ STEP 2: refresh progress immediately
      const updated = await getProgress();
      setProgress(updated);

      const isLast = activeTopicIndex === activeChapter.topics.length - 1;

      if (!isLast) {
      topRef.current?.scrollIntoView({ behavior: "smooth" });

      setActiveTopicIndex((prev) => (prev ?? 0) + 1);
    } else {
        // ✅ ONLY open test (DO NOT mark chapter here)
        setShowTestModal(true);
      }

    } catch (error) {
      console.error("Failed to update topic progress", error);
    }
  };

  const handleChapterTestComplete = async () => {
  try {
    // ✅ STEP 1: mark chapter complete AFTER test
    await markChapterPractice(
      activeModule._id,
      activeChapter.chapterKey, 
      activeModule.chapters.length
    );

    // ✅ STEP 2: force fresh progress
    const updated = await getProgress();
    setProgress(updated);

  } catch (error) {
    console.error("Failed to mark chapter complete", error);
  }
};

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffbeb] p-6">
        <div className="w-full max-w-md rounded-[2rem] border-[6px] border-black bg-white p-8 text-center shadow-[16px_16px_0px_black]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-black bg-yellow-400">
            <Brain className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black uppercase">Loading Knowledge Vault...</h2>
          <p className="mt-3 text-sm font-semibold text-black/70">
            Preparing your modules, chapters, and practice flow.
          </p>
        </div>
      </main>
    );
  }

  // ================= MODULE LIST =================
  if (!activeModule) {
    return (
      <div className="space-y-8">
        <section className="rounded-[2rem] border-[6px] border-black bg-white p-6 shadow-[16px_16px_0px_black] md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">Learning path</p>
              <h1 className="mt-2 text-3xl font-black uppercase md:text-4xl">Choose your next module</h1>
              <p className="mt-3 text-sm font-semibold leading-7 text-black/70 md:text-base">
                Follow a beautifully guided study journey with topic notes, chapter practice, and quick progress checkpoints.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border-[4px] border-black bg-yellow-400 px-4 py-2 text-sm font-black">
              <Sparkles size={16} />
              AI Olympiad learning
            </div>
          </div>
        </section>

        <div className="space-y-8">
          {['4-5', '6-8', '9-10', '11-12', '1-2', '3-4'].map((level) => {
            if (!grouped[level]?.length) return null;

            return (
              <div key={level} className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b-[4px] border-black pb-2">
                  <h2 className="text-2xl font-black uppercase md:text-3xl">Level {levelMap[level]}</h2>
                  <div className="rounded-full border-[3px] border-black bg-[#fffbeb] px-3 py-1 text-xs font-black uppercase">
                    {grouped[level].length} modules
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {grouped[level].map((m: any) => {
                    const unlocked = isModuleUnlocked(m);
                    const moduleProgress = getModuleProgress(m._id);
                    const completed = Boolean(moduleProgress?.moduleTestPassed);

                    return (
                      <div key={m._id} className="group relative">
                        {!unlocked && !isAdminUser && (
                          <div className="absolute -top-3 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border-2 border-yellow-400 bg-black px-4 py-2 text-xs font-black uppercase text-white shadow-[4px_4px_0px_#facc15] group-hover:flex">
                            <Lock size={12} /> Unlock after the previous module test
                          </div>
                        )}
                        <div
                          onClick={() => {
                            if (!unlocked) return;
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            setActiveModule(m);
                          }}
                          className={`cursor-pointer rounded-[1.6rem] border-[5px] border-black p-6 shadow-[10px_10px_0px_black] transition duration-200 ${
                            unlocked
                              ? completed
                                ? "bg-green-100 hover:-translate-y-1 hover:shadow-[12px_12px_0px_black]"
                                : "bg-white hover:-translate-y-1 hover:shadow-[12px_12px_0px_black]"
                              : "cursor-not-allowed bg-gray-200 opacity-70"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-3">
                              <div className="inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-yellow-400 px-3 py-1 text-xs font-black uppercase">
                                <BookOpen size={14} />
                                {m.chapters?.length || 0} chapters
                              </div>
                              <div>
                                <h3 className="text-xl font-black">{m.title}</h3>
                                <p className="mt-2 text-sm font-semibold leading-7 text-black/70">{m.description}</p>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              {!unlocked ? (
                                <div className="rounded-full border-[3px] border-black bg-white p-2">
                                  <Lock className="h-4 w-4" />
                                </div>
                              ) : completed ? (
                                <div className="rounded-full border-[3px] border-black bg-green-300 p-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <ul className="mt-5 space-y-2 text-sm font-bold text-black/70">
                            {m.chapters?.slice(0, 4).map((c: any, i: number) => (
                              <li key={c.chapterKey || i} className="flex items-center gap-2">
                                <span className="inline-block h-2.5 w-2.5 rounded-full border-[2px] border-black bg-yellow-300" />
                                {c.title}
                              </li>
                            ))}
                            {m.chapters?.length > 4 && <li className="font-black uppercase">+ more chapters</li>}
                          </ul>

                          <div className="mt-6 flex items-center justify-between border-t-[3px] border-black pt-4">
                            <span className="text-sm font-black uppercase">
                              {unlocked ? "Open module" : "Locked"}
                            </span>
                            <div className="inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-[#fffbeb] px-3 py-1 text-xs font-black uppercase">
                              <Compass size={12} />
                              {unlocked ? "Study now" : "Locked"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ================= CHAPTER LIST =================
  if (!activeChapter) {
    return (
      <section className="space-y-6">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveModule(null);
          }}
          className="inline-flex items-center gap-2 font-black underline underline-offset-4 transition hover:text-blue-600"
        >
          ← Back to Modules
        </button>

        {renderBreadcrumb()}

        <section className="rounded-[2rem] border-[6px] border-black bg-white p-6 shadow-[14px_14px_0px_black] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">Module overview</p>
              <h2 className="mt-2 text-3xl font-black uppercase">{activeModule.title}</h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-black/70">{activeModule.description}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border-[4px] border-black bg-yellow-400 px-4 py-2 text-sm font-black">
              <BookOpen size={16} />
              {activeModule.chapters?.length || 0} chapters
            </div>
          </div>
        </section>

        <div className="grid gap-4">
          {activeModule.chapters?.map((c: any) => {
            const chapterProgress = getChapterProgress(activeModule._id, c.chapterKey);
            const isCompleted = isAdminUser || chapterProgress?.chapterTestPassed === true;

            return (
              <div
                key={c.chapterKey}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setActiveChapter(c);
                  setActiveTopicIndex(null);
                }}
                className={`cursor-pointer rounded-[1.4rem] border-[5px] border-black p-6 shadow-[8px_8px_0px_black] transition ${
                  isCompleted
                    ? "bg-green-100 hover:-translate-y-1"
                    : "bg-white hover:-translate-y-1 hover:bg-[#fff8dc]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/60">Chapter</p>
                    <h3 className="mt-1 text-xl font-black">{c.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {Boolean(chapterProgress?.chapterTestPassed) && (
                      <span className="rounded-full border-[3px] border-black bg-green-300 px-3 py-1 text-xs font-black uppercase">
                        Done
                      </span>
                    )}
                    <span className="rounded-full border-[3px] border-black bg-[#fffbeb] px-3 py-1 text-xs font-black uppercase">
                      Open
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // ================= TOPIC LIST =================
  if (activeTopicIndex === null) {
    return (
      <section className="space-y-6">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveChapter(null);
          }}
          className="inline-flex items-center gap-2 font-black underline underline-offset-4 transition hover:text-blue-600"
        >
          ← Back to Chapters
        </button>

        {renderBreadcrumb()}

        <section className="rounded-[2rem] border-[6px] border-black bg-white p-6 shadow-[14px_14px_0px_black] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">Chapter topics</p>
              <h2 className="mt-2 text-3xl font-black uppercase">{activeChapter.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-black/70">Select a topic to open notes and continue your study flow.</p>
            </div>
            <div className="rounded-full border-[4px] border-black bg-yellow-400 px-4 py-2 text-sm font-black">
              {activeChapter.topics?.length || 0} topics
            </div>
          </div>
        </section>

        <div className="grid gap-4">
          {activeChapter.topics?.map((t: any, i: number) => {
            const chapterProgress = getChapterProgress(
              activeModule._id,
              activeChapter.chapterKey
            );

            const topicProgress = getTopicProgress(
              activeModule._id,
              activeChapter.chapterKey,
              t._id
            );

            const isCompleted =
              isAdminUser ||
              chapterProgress?.chapterTestPassed ||
              topicProgress?.completed;

            return (
              <div
                key={t._id}
                onClick={() => {
                  setShowTestModal(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setActiveTopicIndex(i);
                }}
                className={`cursor-pointer rounded-[1.4rem] border-[5px] border-black p-6 shadow-[8px_8px_0px_black] transition ${
                  isCompleted
                    ? "bg-green-100 hover:-translate-y-1"
                    : "bg-white hover:-translate-y-1 hover:bg-[#fff8dc]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-black bg-yellow-400 font-black">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/60">Topic</p>
                      <h3 className="mt-1 text-lg font-black">{t.title}</h3>
                    </div>
                  </div>
                  {isCompleted ? (
                    <span className="rounded-full border-[3px] border-black bg-green-300 px-3 py-1 text-xs font-black uppercase">
                      Done
                    </span>
                  ) : (
                    <span className="rounded-full border-[3px] border-black bg-[#fffbeb] px-3 py-1 text-xs font-black uppercase">
                      Continue
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // ================= TOPIC VIEW =================
  const topic = activeChapter.topics[activeTopicIndex];
  const isFirst = activeTopicIndex === 0;
  const isLast = activeTopicIndex === activeChapter.topics.length - 1;

  return (
    <>
      <section className="space-y-8">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveTopicIndex(null);
          }}
          className="inline-flex items-center gap-2 font-black underline underline-offset-4 transition hover:text-blue-600"
        >
          ← Back to Topics
        </button>

        {renderBreadcrumb()}

        <section className="rounded-[2rem] border-[6px] border-black bg-white p-6 shadow-[14px_14px_0px_black] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">Topic study</p>
              <h2 className="mt-2 text-3xl font-black uppercase">{topic?.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-black/70">{activeChapter.title} • {activeModule.title}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border-[4px] border-black bg-yellow-400 px-4 py-2 text-sm font-black">
              <Sparkles size={16} />
              {isLast ? "Final topic" : `Topic ${activeTopicIndex + 1}`}
            </div>
          </div>
        </section>

        {topic?.videoUrl && (
          <div className="overflow-hidden rounded-[1.6rem] border-[6px] border-black bg-black shadow-[12px_12px_0px_black]">
            <iframe src={topic.videoUrl} className="aspect-video w-full" title={topic.title} />
          </div>
        )}

        {contentLoading ? (
          <div className="animate-pulse rounded-[1.6rem] border-[6px] border-black bg-[#fffbeb] p-10 text-center font-black">
            Loading Notes...
          </div>
        ) : (
          <div
            ref={topRef}
            className="markdown-body rounded-[1.6rem] border-[6px] border-black bg-white p-6 shadow-[12px_12px_0px_black] md:p-10"
            suppressHydrationWarning
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              skipHtml={false}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="mt-6 mb-4 text-3xl font-bold" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="mt-6 mb-3 text-2xl font-semibold" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="mt-5 mb-3 text-xl font-semibold" {...props} />
                ),
                h4: ({ node, ...props }) => (
                  <h4 className="mt-4 mb-2 text-lg font-semibold" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 text-base leading-relaxed md:text-lg" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="mb-4 list-disc space-y-2 pl-6" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="mb-4 list-decimal space-y-2 pl-6" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-base md:text-lg" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-black" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic text-gray-700" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="font-medium text-blue-600 underline" target="_blank" rel="noreferrer" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="my-4 border-l-4 border-black pl-4 italic text-gray-600" {...props} />
                ),
                pre: ({ node, ...props }: any) => (
                  <pre className="my-4 block overflow-x-auto rounded-lg bg-black p-4 text-green-400" {...props} />
                ),
                code({ inline, className, children, ...props }: any) {
                  if (inline) {
                    return (
                      <code className="rounded bg-gray-200 px-2 py-1 font-mono text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="font-mono text-sm text-green-400" {...props}>
                      {children}
                    </code>
                  );
                },
                table: ({ node, ...props }) => (
                  <div className="my-6 overflow-x-auto">
                    <table className="min-w-full border-2 border-black" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="border border-black bg-yellow-300 px-4 py-2 text-left font-bold" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="border border-black px-4 py-2" {...props} />
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            disabled={isFirst}
            onClick={() => setActiveTopicIndex((prev) => (prev ?? 0) - 1)}
            className="inline-flex items-center justify-center gap-2 rounded-[1rem] border-[4px] border-black bg-white px-6 py-3 font-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft size={18} /> Previous
          </button>

          <button
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 rounded-[1rem] border-[4px] border-black bg-yellow-400 px-6 py-3 font-black transition hover:bg-yellow-300"
          >
            {isLast ? "Practice Chapter" : "Next"}
            <ArrowRight size={18} />
          </button>
        </div>

        <button
          onClick={() => {
            window.scrollTo({
              top: scrollDirection === "top" ? 0 : document.body.scrollHeight,
              behavior: "smooth",
            });
          }}
          className="fixed bottom-6 right-6 z-[1000] flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-yellow-400 shadow-[4px_4px_0px_black] transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1"
        >
          <ArrowUp
            size={20}
            className={`transition-transform duration-300 ${scrollDirection === "bottom" ? "rotate-180" : "rotate-0"}`}
          />
        </button>
      </section>

      <ChapterTestModal
        isOpen={showTestModal}
        onClose={() => {
          setShowTestModal(false);
          setActiveTopicIndex(null);
          setActiveChapter(null);
        }}
        chapterTitle={activeChapter?.description || activeChapter?.title}
        practiceUrl={activeChapter?.practiceUrl}
        onComplete={handleChapterTestComplete}
      />
    </>
  );
}
