"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play, ShieldAlert, AlertCircle } from "lucide-react";
import { startOlympiadAttempt, checkOlympiadCooldown } from "@/services/olympiad";

export default function OlympiadInstructionsPage() {
  const router = useRouter();
  const [cooldownChecked, setCooldownChecked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [starting, setStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 1. Check if user is in cooldown to prevent starting if they try to bypass via URL
  useEffect(() => {
    async function checkStatus() {
      try {
        const cooldownRes = await checkOlympiadCooldown();
        if (cooldownRes.success && cooldownRes.data.inCooldown) {
          router.replace("/dashboard/olympiad");
          return;
        }
        setCooldownChecked(true);
      } catch (err) {
        console.error("Failed cooldown validation:", err);
      }
    }
    checkStatus();
  }, [router]);

  const handleStartExam = async () => {
    if (!isChecked) return;
    setStarting(true);
    setErrorMessage("");

    try {
      // Force entering fullscreen mode first
      const docEl = document.documentElement;
      try {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if ((docEl as any).mozRequestFullScreen) { /* Firefox */
          await (docEl as any).mozRequestFullScreen();
        } else if ((docEl as any).webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          await (docEl as any).webkitRequestFullscreen();
        } else if ((docEl as any).msRequestFullscreen) { /* IE/Edge */
          await (docEl as any).msRequestFullscreen();
        }
      } catch (fErr) {
        console.error("Fullscreen request failed:", fErr);
        throw new Error("Fullscreen mode is mandatory to start the exam. Please allow fullscreen.");
      }

      // Start the attempt (backend will randomly select set, shuffle, and return sanitized questions)
      const res = await startOlympiadAttempt();
      if (res.success) {
        // Redirect to examination workspace
        router.push("/dashboard/olympiad/exam");
      } else {
        setErrorMessage("Could not initialize session. Please try again.");
        setStarting(false);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setErrorMessage(errorMsg);
      setStarting(false);
    }
  };

  if (!cooldownChecked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-mono">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
        <p className="mt-4 font-bold uppercase">Preparing instructions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono text-black max-w-4xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div>
        <button
          onClick={() => router.push("/dashboard/olympiad")}
          className="flex items-center gap-2 font-black uppercase text-sm border-4 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_black] transition-all"
        >
          <ArrowLeft size={16} />
          Back to Overview
        </button>
      </div>

      {/* Rules & Instructions */}
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_black] space-y-6">
        <h1 className="text-3xl font-black uppercase border-b-4 border-black pb-4 flex items-center gap-3">
          <ShieldAlert size={28} className="text-yellow-500" />
          Instructions & Rules
        </h1>

        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase">1. General Guidelines</h3>
          <ul className="list-decimal list-inside font-bold text-sm uppercase space-y-2 leading-relaxed opacity-90">
            <li>The exam contains exactly <span className="bg-yellow-100 border border-black px-1">60 Questions</span> to be completed in <span className="bg-yellow-100 border border-black px-1">60 Minutes</span>.</li>
            <li>Every question is a Multiple Choice Question (MCQ) with 4 options (A, B, C, D).</li>
            <li>There is no &quot;Save&quot; button; answers are autosaved automatically the instant you select an option.</li>
            <li>You may navigate freely between questions using the sidebar palette or the Prev/Next buttons.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase">2. Marking Scheme</h3>
          <ul className="list-disc list-inside font-bold text-sm uppercase space-y-2 leading-relaxed opacity-90">
            <li><span className="text-green-700 font-black">+4 Marks</span> for each correct response.</li>
            <li><span className="text-red-600 font-black">-1 Mark</span> for each incorrect response.</li>
            <li><span className="text-gray-600 font-black">0 Marks</span> for unanswered questions.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase text-red-600">3. Integrity Rules</h3>
          <p className="font-bold text-sm uppercase leading-relaxed opacity-90">
            By launching this exam, you acknowledge that you must maintain fullscreen mode:
          </p>
          <ul className="list-disc list-inside font-bold text-xs uppercase space-y-1.5 leading-relaxed opacity-85">
            <li>Exiting fullscreen mode or switching tabs is not allowed.</li>
            <li>If you exit fullscreen, your exam session will be paused and covered by a lock overlay until you return to fullscreen mode.</li>
            <li>Right-click copy, paste, and text selection are disabled during the examination.</li>
          </ul>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-200 border-4 border-black p-4 font-black uppercase text-sm text-red-800 flex items-center gap-2 shadow-[4px_4px_0px_black]">
            <AlertCircle size={18} />
            {errorMessage}
          </div>
        )}

        {/* Policy Consent Agreement Checkbox */}
        <div className="pt-4 border-t-4 border-black space-y-4">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-1 h-5 w-5 accent-blue-600 cursor-pointer border-2 border-black"
            />
            <span className="font-black text-xs md:text-sm uppercase leading-normal">
              I agree to the guidelines, will maintain fullscreen, and understand I can attempt only one exam every 24 hours.
            </span>
          </label>

          <div>
            <button
              onClick={handleStartExam}
              disabled={!isChecked || starting}
              className={`w-full md:w-auto font-black uppercase text-sm px-8 py-4 border-4 border-black shadow-[4px_4px_0px_black] transition-all flex items-center justify-center gap-2
                ${
                  isChecked && !starting
                    ? "bg-green-400 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none border-gray-400"
                }`}
            >
              {starting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Launching Exam...
                </>
              ) : (
                <>
                  <Play size={18} fill="currentColor" />
                  Launch Mock Olympiad
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
