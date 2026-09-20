"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Clock, AlertTriangle, Play, RefreshCw } from "lucide-react";
import { checkOlympiadCooldown, getCurrentOlympiadSession, OlympiadSession } from "@/services/olympiad";
import { getProfile } from "@/services/auth";

interface UserProfile {
  username?: string;
  level?: string;
  email?: string;
  name?: string;
}

export default function OlympiadLandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cooldown, setCooldown] = useState<{ inCooldown: boolean; cooldownUntil: string | null }>({
    inCooldown: false,
    cooldownUntil: null,
  });
  const [activeSession, setActiveSession] = useState<OlympiadSession | null>(null);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, cooldownRes, sessionRes] = await Promise.all([
          getProfile(),
          checkOlympiadCooldown(),
          getCurrentOlympiadSession(),
        ]);

        if (profRes) {
          setProfile(profRes);
        }
        if (cooldownRes && cooldownRes.success) {
          setCooldown(cooldownRes.data);
        }
        if (sessionRes && sessionRes.success) {
          setActiveSession(sessionRes.data);
        }
      } catch (err) {
        console.error("Failed to load Olympiad landing page data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
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
        <p className="mt-4 font-bold uppercase">Loading examination status...</p>
      </div>
    );
  }

  const userLevel = profile?.level || "Not Configured";

  return (
    <div className="space-y-8 font-mono text-black">
      {/* Header Banner */}
      <div className="bg-yellow-400 border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_black] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={32} className="stroke-[2.5]" />
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                Mock Olympiad
              </h1>
            </div>
            <p className="text-sm md:text-base font-bold uppercase opacity-90 max-w-xl">
              Challenge yourself, measure your intelligence, and practice for actual exams in a realistic, timed environment.
            </p>
          </div>
          <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_black] self-start md:self-auto">
            <span className="block text-xs uppercase font-black opacity-60">Academic Level</span>
            <span className="text-lg font-black uppercase text-blue-600">{userLevel}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status / Call To Action Panel */}
        <div className="lg:col-span-2 space-y-6">
          {activeSession ? (
            /* Active Session Panel */
            <div className="bg-blue-400 border-4 border-black p-6 shadow-[6px_6px_0px_black] space-y-4">
              <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                <RefreshCw className="animate-spin" size={24} />
                Active Attempt Detected!
              </h2>
              <p className="font-bold uppercase text-sm">
                You have an active examination session started on{" "}
                <span className="bg-white px-2 py-0.5 border-2 border-black">
                  {new Date(activeSession.startedAt).toLocaleTimeString()}
                </span>
                . Refreshing the browser or navigating away did not reset your session.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => router.push("/dashboard/olympiad/exam")}
                  className="bg-white text-black font-black uppercase px-6 py-3 border-4 border-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
                >
                  <Play size={18} fill="black" />
                  Resume Active Session
                </button>
              </div>
            </div>
          ) : cooldown.inCooldown ? (
            /* Cooldown Panel */
            <div className="bg-red-400 border-4 border-black p-6 shadow-[6px_6px_0px_black] space-y-4">
              <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                <Clock size={24} />
                Cooldown Active
              </h2>
              <p className="font-bold uppercase text-sm">
                You have already attempted a Mock Olympiad exam within the last 24 hours. Under platform guidelines, students are allowed exactly one attempt every 24 hours to encourage structured practice.
              </p>
              <div className="bg-white border-4 border-black p-4 inline-block shadow-[4px_4px_0px_black]">
                <span className="block text-xs uppercase font-black opacity-60">Time remaining until next attempt</span>
                <span className="text-3xl font-black tracking-wide">{cooldownTimeLeft || "calculating..."}</span>
              </div>
            </div>
          ) : (
            /* Normal Attempt Start Panel */
            <div className="bg-green-400 border-4 border-black p-6 shadow-[6px_6px_0px_black] space-y-4">
              <h2 className="text-2xl font-black uppercase">Ready for Attempt</h2>
              <p className="font-bold uppercase text-sm">
                You are eligible to start a Mock Olympiad attempt. Ensure you have a quiet study space, a stable internet connection, and exactly 60 minutes of uninterrupted time.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => router.push("/dashboard/olympiad/instructions")}
                  className="bg-white text-black font-black uppercase px-6 py-3 border-4 border-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
                >
                  <Play size={18} fill="black" />
                  Start Mock Olympiad
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats Summary */}
          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_black] space-y-4">
            <h3 className="text-xl font-black uppercase">Rules & Scheme Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="border-2 border-black p-3 bg-yellow-100">
                <span className="block text-xs uppercase font-bold opacity-60">Total Questions</span>
                <span className="text-xl font-black">60 MCQs</span>
              </div>
              <div className="border-2 border-black p-3 bg-blue-100">
                <span className="block text-xs uppercase font-bold opacity-60">Duration</span>
                <span className="text-xl font-black">60 Mins</span>
              </div>
              <div className="border-2 border-black p-3 bg-green-100">
                <span className="block text-xs uppercase font-bold opacity-60">Correct Answer</span>
                <span className="text-xl font-black text-green-700">+4 Marks</span>
              </div>
              <div className="border-2 border-black p-3 bg-red-100">
                <span className="block text-xs uppercase font-bold opacity-60">Wrong Answer</span>
                <span className="text-xl font-black text-red-600">-1 Mark</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & System Constraints Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_black] space-y-4">
            <h3 className="text-lg font-black uppercase flex items-center gap-2 text-red-600">
              <AlertTriangle size={20} />
              Proctoring Policies
            </h3>
            <p className="text-xs font-bold uppercase leading-relaxed opacity-95">
              The system employs strict client-side tracking to enforce test integrity:
            </p>
            <ul className="text-xs uppercase font-bold space-y-2 list-disc list-inside opacity-80">
              <li>Fullscreen mode is required throughout the test.</li>
              <li>A webcam setup check runs on startup to monitor focus.</li>
              <li>Warnings trigger upon tab changes, right-click, or copy-paste.</li>
              <li>The server timer runs independently of local system clock settings.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
