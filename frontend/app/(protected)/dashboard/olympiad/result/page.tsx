"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, AlertCircle, ArrowRight, LayoutDashboard, Clock, Check, X, ShieldAlert } from "lucide-react";
import { checkOlympiadCooldown } from "@/services/olympiad";

interface ReviewQuestion {
  id: string;
  question: string;
  options: { label: string; text: string }[];
  selectedOption: string | null;
  correctOption: string;
  isCorrect: boolean;
}

interface OlympiadResult {
  finalScore: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  unansweredCount: number;
  questions: ReviewQuestion[];
}

export default function OlympiadResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cooldown, setCooldown] = useState<{ inCooldown: boolean; cooldownUntil: string | null }>({
    inCooldown: false,
    cooldownUntil: null,
  });
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<string>("");
  const [result, setResult] = useState<OlympiadResult | null>(null);

  // Load results from sessionStorage immediately on mount, then clear them
  useEffect(() => {
    const stored = sessionStorage.getItem("olympiad_result");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setResult(parsed);
      } catch (err) {
        console.error("Failed to parse stored result:", err);
      } finally {
        sessionStorage.removeItem("olympiad_result"); // Evict immediately for privacy/security
      }
    }

    async function loadCooldown() {
      try {
        const res = await checkOlympiadCooldown();
        if (res.success) {
          setCooldown(res.data);
        }
      } catch (err) {
        console.error("Failed to load cooldown for result page:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCooldown();
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (!cooldown.inCooldown || !cooldown.cooldownUntil) return;

    function updateTimer() {
      const until = new Date(cooldown.cooldownUntil!).getTime();
      const now = Date.now();
      const diff = until - now;

      if (diff <= 0) {
        setCooldown({ inCooldown: false, cooldownUntil: null });
        setCooldownTimeLeft("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hStr = hours.toString().padStart(2, "0");
      const mStr = minutes.toString().padStart(2, "0");
      const sStr = seconds.toString().padStart(2, "0");

      setCooldownTimeLeft(`${hStr}h ${mStr}m ${sStr}s`);
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-mono">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
        <p className="mt-4 font-bold uppercase">Retrieving test outcome...</p>
      </div>
    );
  }

  // If they somehow land on this page without being in a cooldown (i.e. they haven't submitted any exam yet)
  if (!cooldown.inCooldown && !result) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 pt-12 font-mono text-black">
        <div className="bg-yellow-400 border-4 border-black p-6 shadow-[6px_6px_0px_black] space-y-4">
          <AlertCircle className="mx-auto text-black" size={48} />
          <h2 className="text-2xl font-black uppercase">No Active Result</h2>
          <p className="font-bold text-xs uppercase opacity-90">
            No recently submitted Mock Olympiad session was detected. You can attempt a new test now.
          </p>
          <button
            onClick={() => router.push("/dashboard/olympiad")}
            className="w-full bg-white text-black font-black uppercase text-xs py-3 border-4 border-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            Go to Olympiad Dashboard
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-mono text-black">
      {/* Celebration Header */}
      <div className="bg-yellow-400 border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_black] text-center space-y-4 relative overflow-hidden">
        <Trophy size={48} className="mx-auto stroke-[2.5]" />
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
          Olympiad Finished!
        </h1>
        <p className="text-xs font-black uppercase opacity-90 leading-relaxed max-w-md mx-auto">
          Congratulations on completing your practice session. Review your score sheet and detailed responses below.
        </p>
      </div>

      {result ? (
        <>
          {/* Detailed Score card */}
          <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_black] space-y-6">
            <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3 flex items-center gap-2">
              Performance Summary
            </h2>

            {/* Score Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-blue-400 border-4 border-black p-4 shadow-[3px_3px_0px_black] flex flex-col justify-center items-center text-center">
                <span className="text-[10px] uppercase font-black opacity-80">Final Score</span>
                <span className="text-2xl font-black mt-1">{result.finalScore} / 240</span>
              </div>
              <div className="bg-green-400 border-4 border-black p-4 shadow-[3px_3px_0px_black] flex flex-col justify-center items-center text-center">
                <span className="text-[10px] uppercase font-black opacity-80">Correct</span>
                <span className="text-2xl font-black mt-1">{result.correctAnswersCount} ({result.correctAnswersCount * 4} pts)</span>
              </div>
              <div className="bg-red-400 border-4 border-black p-4 shadow-[3px_3px_0px_black] flex flex-col justify-center items-center text-center">
                <span className="text-[10px] uppercase font-black opacity-80">Wrong</span>
                <span className="text-2xl font-black mt-1">{result.wrongAnswersCount} (-{result.wrongAnswersCount} pts)</span>
              </div>
              <div className="bg-gray-200 border-4 border-black p-4 shadow-[3px_3px_0px_black] flex flex-col justify-center items-center text-center">
                <span className="text-[10px] uppercase font-black opacity-80">Unanswered</span>
                <span className="text-2xl font-black mt-1">{result.unansweredCount}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-800 p-4 text-[11px] font-bold uppercase leading-relaxed text-yellow-950">
              ⚠️ PRIVACY NOTICE: Under our security principles, this detailed scorecard is only saved temporarily in your local browser memory. **It is not stored in our databases.** Once you close or reload this window, this review sheet will be permanently deleted.
            </div>
          </div>

          {/* Question Review Checklist */}
          <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_black] space-y-6">
            <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3">
              Question Review
            </h2>

            <div className="space-y-8 max-h-[600px] overflow-y-auto pr-2">
              {result.questions.map((q, idx) => {
                let statusLabel = "Unanswered";
                let statusColor = "bg-gray-200 border-gray-400 text-gray-700";
                let marksLabel = "+0";

                if (q.selectedOption) {
                  if (q.isCorrect) {
                    statusLabel = "Correct";
                    statusColor = "bg-green-100 border-green-800 text-green-800";
                    marksLabel = "+4";
                  } else {
                    statusLabel = "Incorrect";
                    statusColor = "bg-red-100 border-red-800 text-red-800";
                    marksLabel = "-1";
                  }
                }

                return (
                  <div key={q.id} className="border-4 border-black p-5 space-y-4 shadow-[4px_4px_0px_black] bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                      <span className="font-black text-xs uppercase">
                        Question {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase border-2 px-2 py-0.5 ${statusColor}`}>
                          {statusLabel}
                        </span>
                        <span className={`text-[9px] font-black uppercase border-2 px-2 py-0.5 ${q.selectedOption && q.isCorrect ? "bg-green-400 border-black" : q.selectedOption ? "bg-red-400 border-black" : "bg-gray-300 border-black"}`}>
                          {marksLabel} Marks
                        </span>
                      </div>
                    </div>

                    {/* Question body */}
                    <p className="font-black text-sm leading-relaxed">{q.question}</p>

                    {/* Options list */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {q.options.map((opt) => {
                        const isUserChoice = q.selectedOption === opt.label;
                        const isCorrectChoice = q.correctOption === opt.label;

                        let optionStyle = "border-2 border-black bg-white";
                        let checkIcon = null;

                        if (isCorrectChoice) {
                          optionStyle = "border-4 border-green-700 bg-green-50 text-green-950 font-black";
                          checkIcon = <Check className="text-green-700 ml-auto" size={16} />;
                        } else if (isUserChoice && !q.isCorrect) {
                          optionStyle = "border-4 border-red-700 bg-red-50 text-red-950 font-black";
                          checkIcon = <X className="text-red-700 ml-auto" size={16} />;
                        }

                        return (
                          <div key={opt.label} className={`p-3 text-xs uppercase flex items-center gap-3 transition-all ${optionStyle}`}>
                            <span className={`flex items-center justify-center h-6 w-6 border-2 border-black font-black
                              ${isCorrectChoice ? "bg-green-700 text-white" : isUserChoice ? "bg-red-700 text-white" : "bg-black text-white"}`}>
                              {opt.label}
                            </span>
                            <span className="flex-1 leading-normal">{opt.text}</span>
                            {checkIcon}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Rendered when the result is already deleted from memory (e.g. page refreshed) */
        <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_black] space-y-4">
          <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3 flex items-center gap-2">
            <ShieldAlert className="text-yellow-600" size={20} />
            Responses Cleared
          </h2>
          <p className="text-xs font-bold uppercase opacity-80 leading-relaxed text-justify">
            Under Mock Olympiad security guidelines, detailed reviews of correct and wrong responses are only visible immediately upon completing the exam and are never saved on the server database. 
          </p>
          <p className="text-xs font-bold uppercase opacity-85 leading-relaxed text-justify">
            Since this page was refreshed or closed, your temporary response review sheet has been permanently evicted from browser memory.
          </p>
        </div>
      )}

      {/* 24 Hour Cooldown Section */}
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_black] space-y-6">
        <div className="bg-red-50 border-4 border-black p-6 shadow-[4px_4px_0px_black] space-y-4">
          <h3 className="text-sm font-black uppercase flex items-center gap-2 text-red-600">
            <Clock size={16} />
            Next Attempt Eligibility
          </h3>
          <p className="text-xs font-bold uppercase opacity-80 leading-relaxed">
            A 24-hour cooling-off period has been activated on your account. You can start your next practice Mock Olympiad attempt when this timer expires.
          </p>
          <div className="bg-white border-4 border-black p-3 inline-block shadow-[2.5px_2.5px_0px_black]">
            <span className="block text-[9px] uppercase font-black opacity-50">Cooldown remaining</span>
            <span className="text-xl font-black tracking-wide">{cooldownTimeLeft || "calculating..."}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t-2 border-black flex gap-4">
          <button
            onClick={() => router.push("/dashboard/olympiad")}
            className="bg-yellow-400 text-black font-black uppercase text-xs px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
          >
            <Trophy size={14} />
            Olympiad Overview
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-black text-white font-black uppercase text-xs px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
          >
            <LayoutDashboard size={14} />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
