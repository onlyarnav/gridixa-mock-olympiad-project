"use client";

import Link from "next/link";
import { Home, ArrowLeft, BookOpen, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fff9e6] text-black font-mono flex items-center justify-center p-6">
      <div className="w-full max-w-3xl border-4 border-black bg-white shadow-[12px_12px_0px_black] overflow-hidden">
        <div className="bg-yellow-100 text-white px-6 py-5 border-b-4 border-black">
          <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.35em] text-black/60">
            Gridixa AI Olympiad
          </p>
          <h1 className="mt-2 text-3xl md:text-5xl font-black uppercase italic leading-none text-black">
            404 — Page Not Found
          </h1>
          <p className="mt-3 text-sm md:text-base font-bold text-black/80 max-w-2xl">
            The page you are looking for seems to have vanished from the Olympiad universe.
          </p>
        </div>

        <div className="grid md:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 md:p-10 bg-gradient-to-br from-yellow-300 via-[#fff9e6] to-blue-200 border-b-4 md:border-b-0 md:border-r-4 border-black">
            <div className="inline-flex items-center gap-2 border-4 border-black bg-pink-500 text-white px-4 py-2 font-black uppercase text-xs shadow-[4px_4px_0px_black]">
              <Sparkles size={16} />
              Lost Content
            </div>

            <div className="mt-6 space-y-4">
              <h2 className="text-2xl md:text-4xl font-black uppercase leading-tight">
                This page does not exist.
              </h2>

              <p className="text-sm md:text-base font-bold leading-7 max-w-xl">
                You may have followed an outdated link, typed the wrong address, or the page may
                have been moved. The good news is: you can get back to the right place in one click.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link href="/">
                <button className="w-full inline-flex items-center justify-center gap-2 border-4 border-black bg-blue-400 text-black px-5 py-4 font-black uppercase shadow-[5px_5px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  <Home size={18} />
                  Go Home
                </button>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="w-full inline-flex items-center justify-center gap-2 border-4 border-black bg-white px-5 py-4 font-black uppercase shadow-[5px_5px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
            </div>

            <div className="mt-6 rounded-2xl border-4 border-black bg-white p-4 shadow-[5px_5px_0px_black]">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                Quick Links
              </p>

              <div className="mt-3 flex flex-col gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 border-2 border-black bg-blue-400 px-4 py-2 font-black text-sm hover:bg-blue-500 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 border-2 border-black bg-pink-400 px-4 py-2 font-black text-sm hover:bg-pink-500 transition"
                >
                  Register
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 border-2 border-black bg-yellow-400 px-4 py-2 font-black text-sm hover:bg-yellow-500 transition"
                >
                  <BookOpen size={16} />
                  Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 bg-white flex flex-col justify-center items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-yellow-300 blur-2xl opacity-40" />
              <div className="relative h-44 w-44 md:h-56 md:w-56 border-4 border-black rounded-full bg-[#fff9e6] shadow-[10px_10px_0px_black] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl md:text-8xl font-black leading-none">404</div>
                  <div className="mt-2 text-[11px] md:text-xs font-black uppercase tracking-[0.3em]">
                    Page Missing
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 max-w-sm">
              <p className="text-base md:text-lg font-black uppercase">
                Keep learning, just not here.
              </p>
              <p className="mt-3 text-sm md:text-base font-bold leading-7 text-gray-700">
                Return to the main site and continue your AI Olympiad journey from the correct
                page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}