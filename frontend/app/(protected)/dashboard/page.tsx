"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ActivityGrid, { calculateStreak } from "@/components/ActivityGrid";
import { getProfile } from "@/services/auth";
import { getModules } from "@/services/module";
import {
  Book,
  PenTool,
  ClipboardList,
  PartyPopper,
  Rocket,
  Smile,
  Flame,
  Sparkles,
  Trophy,
  TrendingUp,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

export default function DashboardHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getProfile();
        if (profile?.role !== "student") {
          router.replace("/admin");
          return;
        }

        setUser(profile);

        const moduleData = await getModules();
        setModules(Array.isArray(moduleData) ? moduleData : []);
      } catch {
        localStorage.clear();
        router.replace("/login?reason=unauthorized");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const testHistory = user?.stats?.testHistory || [];
  const joinedAt = user?.paymentJoinedAt
    ? new Date(user.paymentJoinedAt)
    : null;

  const daysSinceJoin = joinedAt
    ? Math.max(
        1,
        Math.ceil(
          (new Date().getTime() - joinedAt.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 1;

  const modulesCompleted = testHistory.length;
  const TOTAL_MODULES = 7;
  const isCompletedAll = modulesCompleted >= TOTAL_MODULES;
  const nextModuleNumber = isCompletedAll ? null : modulesCompleted + 1;
  const streak = calculateStreak(user?.stats?.activityLog || []);

  const motivationMessage = useMemo(() => {
    if (modulesCompleted === 0) {
      return "Your AI journey begins now. Start your first module and build your foundation.";
    }

    if (isCompletedAll) {
      return "You’ve completed everything. Now refine, revise, and aim for the top ranks.";
    }

    if (modulesCompleted === 1) {
      return "You’ve completed Module 1. Great start! Module 2 is where things get exciting.";
    }

    if (modulesCompleted < 5) {
      return `You’ve completed ${modulesCompleted} modules. Keep the momentum going — consistency is your superpower.`;
    }

    return "You're close to completing the full syllabus. Stay locked in — you're almost there.";
  }, [modulesCompleted, isCompletedAll]);

  const lastModuleEntry = testHistory[testHistory.length - 1];
  const lastModuleData = modules.find(
    (m: any) => String(m._id) === String(lastModuleEntry?.moduleId)
  );
  const lastModuleTitle = lastModuleEntry?.moduleTitle;
  const lastModuleDescription = lastModuleData?.description;

  const quickActions = [
    {
      title: "Continue Learning",
      description: "Pick up your next module and keep the momentum rolling.",
      icon: Book,
      accent: "bg-yellow-400",
      onClick: () => router.push("/dashboard/modules"),
    },
    {
      title: "Take a Module Test",
      description: "Challenge yourself with timed practice and track progress.",
      icon: PenTool,
      accent: "bg-pink-500 text-white",
      onClick: () => router.push("/dashboard/tests"),
    },
    {
      title: "View Student Profile",
      description: "Review your growth, streak and learning snapshot in one place.",
      icon: ClipboardList,
      accent: "bg-blue-400",
      onClick: () => router.push("/dashboard/profile"),
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-[2rem] border-[6px] border-black bg-[#fff9e6] p-8 text-center shadow-[12px_12px_0px_black]">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 animate-spin rounded-full border-[6px] border-dashed border-black md:h-32 md:w-32" />
          <div className="h-12 w-12 border-4 border-black bg-blue-500 shadow-[6px_6px_0px_black] md:h-16 md:w-16" />
        </div>

        <h1 className="mt-10 text-2xl font-black uppercase italic md:text-4xl">
          Syncing Neural Data
        </h1>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] md:text-sm">
          Establishing secure connection...
        </p>

        <div className="mt-6 h-3 w-64 overflow-hidden border-2 border-black bg-white md:w-80">
          <div className="h-full animate-[loadingBar_2s_linear_infinite] bg-black" />
        </div>

        <style jsx>{`
          @keyframes loadingBar {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border-[6px] border-black bg-gradient-to-br from-yellow-300 via-white to-blue-300 p-7 shadow-[16px_16px_0px_black] md:p-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.7)_1px,_transparent_1px)] [background-size:16px_16px] opacity-30" />
        <div className="absolute right-4 top-4 rounded-full border-4 border-black bg-white/80 p-3 shadow-[6px_6px_0px_black]">
          <Sparkles className="h-6 w-6 text-blue-600" />
        </div>

        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border-4 border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em]">
            <ShieldCheck size={14} />
            AI Olympiad Dashboard
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl font-black uppercase leading-tight md:text-5xl">
              Hello {user?.name?.split(" ")[0]} <Smile className="ml-2 inline h-9 w-9 align-top" />
            </h2>
            <p className="text-lg font-black text-blue-700 md:text-xl">
              Welcome to <span className="rounded-lg bg-black px-2 py-1 text-white">Day {daysSinceJoin}</span> of your journey
              <Rocket className="ml-2 inline h-5 w-5 align-middle" />
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.5rem] border-[4px] border-black bg-white/90 p-5 shadow-[8px_8px_0px_black]">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-black/60">
                <Trophy size={14} />
                Current momentum
              </div>

              {modulesCompleted > 0 && lastModuleTitle && (
                <div className="mt-3 rounded-2xl border-2 border-black bg-[#fffbeb] p-3">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-black/60">
                    Last completed module
                  </p>
                  <p className="mt-1 text-sm font-black text-blue-700">
                    {lastModuleTitle}: {lastModuleDescription}
                  </p>
                </div>
              )}

              <div className="mt-4 text-sm font-semibold leading-7 text-black/80">
                {modulesCompleted === 0 ? (
                  <>You haven’t started yet — let’s begin your first module today.</>
                ) : isCompletedAll ? (
                  <div className="font-black text-green-700">
                    <PartyPopper className="mr-2 inline h-4 w-4 align-middle" /> You’ve completed the entire AI Olympiad syllabus.
                  </div>
                ) : (
                  <>
                    You have completed <span className="font-black text-green-600">{modulesCompleted}</span> module{modulesCompleted > 1 ? "s" : ""}.
                    <br />
                    Module <span className="font-black text-blue-600">{nextModuleNumber}</span> awaits you.
                  </>
                )}
              </div>

              <p className="mt-4 text-sm font-bold text-black/70">
                {motivationMessage}
              </p>
            </div>

            <div className="rounded-[1.5rem] border-[4px] border-black bg-[#0f172a] p-5 text-white shadow-[8px_8px_0px_black]">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/70">
                <CalendarDays size={14} />
                Your learning pulse
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-3 py-3">
                  <span className="text-sm font-semibold">Current streak</span>
                  <span className="text-xl font-black">{streak} days</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-3 py-3">
                  <span className="text-sm font-semibold">Tests completed</span>
                  <span className="text-xl font-black">{testHistory.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-3 py-3">
                  <span className="text-sm font-semibold">Progress</span>
                  <span className="text-xl font-black">{Math.min(100, Math.round((modulesCompleted / TOTAL_MODULES) * 100))}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              onClick={action.onClick}
              className={`group text-left rounded-[1.5rem] border-[4px] border-black p-5 shadow-[8px_8px_0px_black] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_black] ${action.accent}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-black bg-white text-black">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 text-xl font-black uppercase">{action.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 opacity-80">{action.description}</p>
            </button>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border-[6px] border-black bg-white p-4 shadow-[12px_12px_0px_black] md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">Learning activity</p>
              <h3 className="text-2xl font-black uppercase">Your consistency map</h3>
            </div>
            <div className="rounded-full border-4 border-black bg-yellow-400 px-3 py-2 text-sm font-black">
              <TrendingUp size={16} className="mr-1 inline" />
              Live
            </div>
          </div>
          <ActivityGrid activityLog={user?.stats?.activityLog || []} />
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.5rem] border-[6px] border-black bg-yellow-400 p-5 shadow-[10px_10px_0px_black]">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/60">Achievement snapshot</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-4xl font-black">{modulesCompleted}</p>
                <p className="text-sm font-semibold">Modules completed</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border-[6px] border-black bg-pink-500 p-5 text-white shadow-[10px_10px_0px_black]">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">Current streak</p>
            <p className="mt-4 text-4xl font-black">{streak}</p>
            <p className="mt-2 text-sm font-semibold leading-6">Keep showing up and your results will keep climbing.</p>
          </div>

          {user?.stats?.activityDays > 3 && (
            <div className="rounded-[1.5rem] border-[6px] border-black bg-blue-500 p-5 text-white shadow-[10px_10px_0px_black]">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">Momentum boost</p>
              <p className="mt-3 text-xl font-black">{user.stats.activityDays} days of learning</p>
              <p className="mt-2 text-sm font-semibold leading-6">That is a strong rhythm — keep the streak alive.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}