"use client";

import React, { useEffect, useState } from "react";
import ProctoredEnv from "@/components/ProctoredEnv";
import { getModuleTests } from "@/services/module";
import { useRouter } from "next/navigation";
import { getProfile } from "@/services/auth";
import { Brain, Clock3, Trophy, Sparkles, ChevronRight } from "lucide-react";

export default function StudentTests() {
  const router = useRouter();
  const [modules, setModules] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<any>({
    "4-5": [],
    "6-8": [],
    "9-10": [],
    "11-12": [],
    "1-2": [],
    "3-4": [],
  });

  const [activeTest, setActiveTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const levelMap: Record<string, string> = {
    "4-5": "1",
    "6-8": "2",
    "9-10": "3",
    "11-12": "4",
    "1-2": "5",
    "3-4": "6",
  };

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const profile = await getProfile();
      setUser(profile);
    };
    load();
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await getModuleTests();

        const groupedData: Record<string, any[]> = {
          "4-5": [],
          "6-8": [],
          "9-10": [],
          "11-12": [],
          "1-2": [],
          "3-4": [],
        };

        data.forEach((m: any) => {
          if (groupedData[m.level]) {
            groupedData[m.level]!.push(m);
          }
        });

        setModules(data);
        setGrouped(groupedData);
      } catch (err) {
        console.error("Module test fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (activeTest) {
    return <ProctoredEnv module={activeTest} onExit={() => setActiveTest(null)} />;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center rounded-[2rem] border-[6px] border-black bg-[#fffbeb] p-6 font-mono shadow-[12px_12px_0px_black]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[4px] border-black bg-yellow-400 shadow-[6px_6px_0px_black]">
            <Brain className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-2xl font-black uppercase italic md:text-4xl">
            Syncing Test Modules...
          </h2>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 font-mono">
      <header className="mb-8 overflow-hidden rounded-[2rem] border-[6px] border-black bg-gradient-to-br from-pink-500 via-fuchsia-500 to-blue-500 p-7 text-white shadow-[16px_16px_0px_black] md:mb-10 md:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border-4 border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-black">
              <Sparkles size={14} />
              Challenge Arena
            </div>
            <h2 className="mt-4 text-3xl font-black uppercase italic tracking-tighter md:text-6xl">
              Module <span className="rounded-lg bg-black px-3 py-1">Tests</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/90 md:text-base">
              Step into a focused practice experience designed for real exam readiness. Each test sharpens your timing, confidence, and concept recall.
            </p>
          </div>
          <div className="rounded-[1.2rem] border-[4px] border-black bg-white/90 p-4 text-black shadow-[8px_8px_0px_black]">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/60">Available today</p>
            <p className="mt-2 text-3xl font-black">{modules.length}</p>
            <p className="text-sm font-semibold">module tests ready</p>
          </div>
        </div>
      </header>

      {['4-5', '6-8', '9-10', '11-12', '1-2', '3-4'].map((level) => {
        if (!grouped[level]?.length) return null;

        return (
          <section key={level} className="mb-10 rounded-[2rem] border-[6px] border-black bg-white p-4 shadow-[12px_12px_0px_black] md:p-6">
            <div className="mb-6 flex items-center justify-between gap-3 border-b-[4px] border-black pb-3">
              <h3 className="text-2xl font-black uppercase md:text-4xl">Level {levelMap[level]}</h3>
              <div className="rounded-full border-4 border-black bg-yellow-400 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
                {grouped[level].length} modules
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {grouped[level].map((m: any) => {
                const totalQuestions = m.moduleTestQuestions || 30;
                const durationMinutes = Math.ceil((totalQuestions * 30) / 60);
                const testData = user?.stats?.testHistory?.find((t: any) => t.moduleId === m._id);

                return (
                  <article
                    key={m._id}
                    className={`group relative overflow-hidden rounded-[1.6rem] border-[6px] border-black p-6 shadow-[12px_12px_0px_black] transition-all hover:-translate-y-1 hover:bg-yellow-400 md:p-8 ${
                      testData?.bestScore > 40 ? "bg-green-200" : "bg-white"
                    }`}
                  >
                    <div className="absolute -right-4 -top-4 rounded-full border-[4px] border-black bg-white/80 px-6 py-4 text-5xl font-black text-gray-400 opacity-20">
                      {testData ? `${testData.bestScore}%` : "AI"}
                    </div>

                    <div className="relative z-10">
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#fffbeb] px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em]">
                        <Trophy size={12} />
                        Practice Ready
                      </div>
                      <h3 className="text-xl font-black uppercase md:text-3xl">{m.title}</h3>
                      <p className="mt-3 text-sm font-semibold leading-7 text-black/70">{m.description}</p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <span className="rounded-full border-2 border-black bg-black px-3 py-1 text-[10px] font-black uppercase text-white">
                          <Brain size={12} className="mr-1 inline" /> {totalQuestions} Questions
                        </span>
                        <span className="rounded-full border-2 border-black bg-blue-500 px-3 py-1 text-[10px] font-black uppercase text-white">
                          <Clock3 size={12} className="mr-1 inline" /> {durationMinutes} Min
                        </span>
                      </div>

                      <button
                        onClick={() => router.push(`/test/${m._id}`)}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-[1rem] border-[4px] border-black bg-blue-600 px-5 py-4 text-sm font-black uppercase text-white shadow-[6px_6px_0px_black] transition active:translate-y-1 active:shadow-none hover:bg-white hover:text-black"
                      >
                        Start Module Test
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      {modules.length === 0 && (
        <div className="rounded-[2rem] border-[6px] border-dashed border-black bg-white p-10 text-center shadow-[12px_12px_0px_black] md:p-20">
          <h3 className="text-2xl font-black uppercase italic text-gray-300 md:text-4xl">
            No Module Tests Available
          </h3>
        </div>
      )}
    </main>
  );
}