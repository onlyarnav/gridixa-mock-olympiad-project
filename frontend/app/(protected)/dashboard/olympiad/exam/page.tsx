"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ShieldAlert, Check, HelpCircle } from "lucide-react";
import { getCurrentOlympiadSession, saveOlympiadAnswer, submitOlympiadAttempt, OlympiadSession, Question, Option } from "@/services/olympiad";

export default function OlympiadExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<OlympiadSession | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  
  // Timer State
  const [timeLeftStr, setTimeLeftStr] = useState<string>("60:00");
  const [expiresTime, setExpiresTime] = useState<number>(0);
  
  // Autosave status
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("saved");

  // Mandatory Fullscreen lock overlay state
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // 1. Load active session on mount
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await getCurrentOlympiadSession();
        if (!res.success || !res.data) {
          // No session found, redirect back
          router.replace("/dashboard/olympiad");
          return;
        }

        const data = res.data;
        setSession(data);
        setExpiresTime(new Date(data.expiresAt).getTime());

        // Extract already answered questions
        const initialAnswers: Record<string, string> = {};
        Object.keys(data.answers).forEach((qId) => {
          if (data.answers[qId]?.selectedOption) {
            initialAnswers[qId] = data.answers[qId].selectedOption!;
          }
        });
        setAnswers(initialAnswers);

        // Mark the first question as visited
        const firstQId = data.questions[0]?.id;
        if (firstQId) {
          setVisited({ [firstQId]: true });
        }
      } catch (err) {
        console.error("Failed to load session details:", err);
        router.replace("/dashboard/olympiad");
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [router]);

  // 2. Authoritative Timer Loop
  useEffect(() => {
    if (expiresTime === 0) return;

    let submitted = false;

    async function handleAutoSubmit() {
      if (submitted) return;
      submitted = true;
      setSaveStatus("saving");
      try {
        const res = await submitOlympiadAttempt();
        if (res.success) {
          sessionStorage.setItem("olympiad_result", JSON.stringify(res.data));
        }
        router.replace("/dashboard/olympiad/result");
      } catch (err) {
        console.error("Auto submit failure:", err);
        router.replace("/dashboard/olympiad/result");
      }
    }

    function tick() {
      const now = Date.now();
      const diff = expiresTime - now;

      if (diff <= 0) {
        setTimeLeftStr("00:00");
        handleAutoSubmit();
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      const mStr = minutes.toString().padStart(2, "0");
      const sStr = seconds.toString().padStart(2, "0");
      setTimeLeftStr(`${mStr}:${sStr}`);
    }

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresTime, router]);

  // 3. Browser Integrity & Strict Fullscreen Lock Enforcement
  useEffect(() => {
    if (loading || !session) return;

    // Force locking when tab blur happens
    const handleBlur = () => {
      setIsLocked(true);
    };

    // Force locking when fullscreen exit happens
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsLocked(true);
      } else {
        setIsLocked(false);
      }
    };

    // Silent Block Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Silent Block Copy & Paste
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Attach listeners
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    // Initial check (if developer refreshes page and it loads outside fullscreen)
    if (!document.fullscreenElement) {
      setIsLocked(true);
    }

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, [loading, session]);

  // 4. Save answer callback
  const handleAnswerSelect = async (optionLabel: string) => {
    if (!session) return;
    const currentQuestion = session.questions[currentIdx];
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;

    // Optimistic state update
    const previousChoice = answers[questionId];
    const isClearing = previousChoice === optionLabel;
    const finalSelection = isClearing ? null : optionLabel;

    setAnswers((prev) => {
      const updated = { ...prev };
      if (isClearing) {
        delete updated[questionId];
      } else {
        updated[questionId] = optionLabel;
      }
      return updated;
    });

    setSaveStatus("saving");

    try {
      const res = await saveOlympiadAnswer(questionId, finalSelection);
      if (res.success) {
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      console.error("Autosave answer failed:", err);
      setSaveStatus("error");
    }
  };

  const handleClearResponse = async () => {
    if (!session) return;
    const currentQuestion = session.questions[currentIdx];
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;

    if (!answers[questionId]) return;

    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });

    setSaveStatus("saving");

    try {
      const res = await saveOlympiadAnswer(questionId, null);
      if (res.success) {
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      console.error("Autosave clear failed:", err);
      setSaveStatus("error");
    }
  };

  const navigateTo = (idx: number) => {
    if (!session || idx < 0 || idx >= session.questions.length) return;
    
    // Mark next question as visited
    const nextQId = session.questions[idx]?.id;
    if (nextQId) {
      setVisited((prev) => ({ ...prev, [nextQId]: true }));
    }
    
    setCurrentIdx(idx);
  };

  const handleSubmitExam = async () => {
    const totalAnswered = Object.keys(answers).length;
    const confirmMsg = `Are you sure you want to submit your Mock Olympiad? You have answered ${totalAnswered} out of 60 questions. You cannot change your choices after submission.`;
    
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await submitOlympiadAttempt();
      if (res.success) {
        sessionStorage.setItem("olympiad_result", JSON.stringify(res.data));
        // Exit fullscreen if active
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        router.replace("/dashboard/olympiad/result");
      }
    } catch (err) {
      console.error("Manual submit failed:", err);
      setLoading(false);
      alert("Submission failed. Please check your internet connection and try again.");
    }
  };

  if (loading || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-mono">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
        <p className="mt-4 font-bold uppercase">Setting up your examination desk...</p>
      </div>
    );
  }

  const currentQuestion = session.questions[currentIdx];
  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-mono">
        <p className="font-bold uppercase text-red-600">Error: Question not found.</p>
      </div>
    );
  }

  const currentAnswer = answers[currentQuestion.id] || null;
  const totalQuestions = session.questions.length;

  return (
    <div className="relative font-mono text-black space-y-6">
      
      {/* Strict Fullscreen Block Overlay */}
      {isLocked && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center text-white p-6 text-center">
          <ShieldAlert size={64} className="text-red-500 mb-4 animate-bounce" />
          <h2 className="text-2xl font-black uppercase mb-2">Fullscreen Mode Enforced!</h2>
          <p className="max-w-md text-sm font-bold uppercase opacity-80 mb-6 leading-relaxed">
            The Mock Olympiad requires fullscreen mode. Exiting fullscreen or switching windows is prohibited. Click the button below to resume.
          </p>
          <button
            onClick={() => {
              const docEl = document.documentElement;
              const enterFullscreen = async () => {
                if (docEl.requestFullscreen) {
                  await docEl.requestFullscreen();
                } else if ((docEl as any).mozRequestFullScreen) {
                  await (docEl as any).mozRequestFullScreen();
                } else if ((docEl as any).webkitRequestFullscreen) {
                  await (docEl as any).webkitRequestFullscreen();
                } else if ((docEl as any).msRequestFullscreen) {
                  await (docEl as any).msRequestFullscreen();
                }
              };
              enterFullscreen()
                .then(() => setIsLocked(false))
                .catch(() => {});
            }}
            className="bg-yellow-400 text-black font-black uppercase text-sm px-6 py-3 border-4 border-black shadow-[4px_4px_0px_white] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Resume Exam in Fullscreen
          </button>
        </div>
      )}

      {/* Top Navigation / Stats bar */}
      <div className="flex flex-col md:flex-row items-stretch gap-4">
        {/* Timer Box */}
        <div className="flex-1 bg-yellow-400 border-4 border-black p-4 shadow-[4px_4px_0px_black] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="animate-pulse stroke-[2.5]" size={28} />
            <div>
              <span className="block text-[10px] uppercase font-black opacity-60">Authorized Timer</span>
              <span className="text-2xl font-black tracking-wider">{timeLeftStr}</span>
            </div>
          </div>
          <div className="bg-white border-2 border-black px-3 py-1 font-bold text-xs uppercase">
            {saveStatus === "saving" ? (
              <span className="text-yellow-600 animate-pulse">Saving...</span>
            ) : saveStatus === "saved" ? (
              <span className="text-green-700">✓ Saved</span>
            ) : (
              <span className="text-red-600">⚠️ Error</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Core Question Layout */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_black] relative min-h-[400px] flex flex-col justify-between">
            <div>
              {/* Question Metadata Header */}
              <div className="flex flex-wrap items-center justify-between border-b-2 border-dashed border-gray-400 pb-4 mb-6 gap-2">
                <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase">
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <p className="text-base md:text-lg font-black leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((opt: Option) => {
                  const selected = currentAnswer === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleAnswerSelect(opt.label)}
                      className={`w-full text-left border-4 border-black p-4 font-black text-sm uppercase transition-all shadow-[4px_4px_0px_black] flex items-center gap-4
                        ${
                          selected
                            ? "bg-blue-400 translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_black]"
                            : "bg-white hover:bg-yellow-50 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black]"
                        }`}
                    >
                      <span className={`flex items-center justify-center h-8 w-8 rounded-none border-2 border-black font-black
                        ${selected ? "bg-white text-black" : "bg-black text-white"}`}>
                        {opt.label}
                      </span>
                      <span className="flex-1 leading-normal">{opt.text}</span>
                      {selected && <Check size={18} className="stroke-[3] text-black" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 pt-6 border-t-2 border-black flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-3">
                <button
                  onClick={() => navigateTo(currentIdx - 1)}
                  disabled={currentIdx === 0}
                  className="font-black uppercase text-xs px-4 py-2.5 border-4 border-black bg-white shadow-[2px_2px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => navigateTo(currentIdx + 1)}
                  disabled={currentIdx === totalQuestions - 1}
                  className="font-black uppercase text-xs px-4 py-2.5 border-4 border-black bg-white shadow-[2px_2px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>

              {currentAnswer && (
                <button
                  onClick={handleClearResponse}
                  className="font-black uppercase text-xs text-red-600 px-4 py-2.5 border-4 border-black bg-white shadow-[2px_2px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  Clear Response
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Panel containing Question Palette and Submit */}
        <div className="space-y-6 col-span-1">
          {/* Question Palette */}
          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_black] space-y-4">
            <h4 className="text-sm font-black uppercase border-b-2 border-black pb-2 flex items-center gap-2">
              <HelpCircle size={16} />
              Question Palette
            </h4>

            {/* Question Numbers Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
              {session.questions.map((q: Question, idx: number) => {
                const hasAnswer = !!answers[q.id];
                const hasVisited = !!visited[q.id];
                const active = currentIdx === idx;

                let stateClass = "bg-white text-black hover:bg-gray-100";
                if (hasAnswer) {
                  stateClass = "bg-green-400 text-black";
                } else if (hasVisited) {
                  stateClass = "bg-red-400 text-black";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => navigateTo(idx)}
                    className={`h-9 border-2 border-black font-black text-xs transition-all flex items-center justify-center shadow-[1.5px_1.5px_0px_black]
                      ${stateClass}
                      ${active ? "outline outline-4 outline-offset-1 outline-blue-600 scale-95" : ""}`}
                  >
                    {(idx + 1).toString().padStart(2, "0")}
                  </button>
                );
              })}
            </div>

            {/* Palette legend */}
            <div className="pt-2 border-t border-gray-300 grid grid-cols-2 gap-2 text-[9px] uppercase font-black text-gray-600">
              <div className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 bg-green-400 border border-black" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 bg-red-400 border border-black" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-1 col-span-2">
                <span className="inline-block h-3 w-3 bg-white border border-black" />
                <span>Unvisited</span>
              </div>
            </div>

            {/* Submit Block */}
            <div className="pt-4 border-t-2 border-black">
              <button
                onClick={handleSubmitExam}
                className="w-full bg-red-600 text-white font-black uppercase text-xs py-3 border-4 border-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                Submit Olympiad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
