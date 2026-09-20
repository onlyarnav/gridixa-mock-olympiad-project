"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // 🔥 Smooth scroll handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b-[4px] border-black bg-white/95 backdrop-blur-md shadow-[0_6px_0_rgba(0,0,0,0.08)] md:border-b-[6px]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:px-8 md:py-4">
        <Link href="/" className="group">
          <div className="flex items-center gap-2 rounded-2xl border-[3px] border-black bg-yellow-400 px-3 py-2 shadow-[4px_4px_0px_black] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:border-[4px] md:px-4">
            <span className="text-lg font-black uppercase tracking-[0.2em] text-black sm:text-xl md:text-2xl">
              GRIDIXA
            </span>
            <span className="hidden rounded-full border-2 border-black bg-white/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 sm:block">
              AI
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border-[3px] border-black bg-[#fff9e6] px-3 py-2 shadow-[3px_3px_0px_rgba(0,0,0,0.12)] md:flex md:gap-3">
          {[
            { id: "about", label: "About" },
            { id: "structure", label: "Structure" },
            { id: "syllabus", label: "Syllabus" },
            { id: "rewards", label: "Rewards" },
            { id: "faqs", label: "FAQs" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-black transition-all duration-200 hover:bg-blue-500 hover:text-white"
            >
              {item.label}
            </button>
          ))}

          {user?.paymentStatus === "completed" ? (
            <Link href="/dashboard">
              <button className="rounded-full border-[3px] border-black bg-pink-500 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[3px_3px_0px_black] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 hover:bg-pink-600">
                Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <button className="rounded-full border-[3px] border-black bg-blue-400 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-black shadow-[3px_3px_0px_black] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 hover:bg-blue-500">
                  Login
                </button>
              </Link>

              <Link href="/register">
                <button className="rounded-full border-[3px] border-black bg-pink-400 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-black shadow-[3px_3px_0px_black] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 hover:bg-pink-500">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-2xl border-[3px] border-black bg-[#fff9e6] p-2.5 shadow-[3px_3px_0px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-yellow-300 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t-[4px] border-black bg-white px-4 py-5 md:hidden">
          <div className="flex flex-col gap-3 font-black uppercase tracking-[0.16em]">
            {[
              { id: "about", label: "About" },
              { id: "structure", label: "Structure" },
              { id: "syllabus", label: "Syllabus" },
              { id: "rewards", label: "Rewards" },
              { id: "faqs", label: "FAQs" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setOpen(false);
                }}
                className="rounded-2xl border-[3px] border-black bg-[#fff9e6] px-4 py-3 text-left text-sm shadow-[3px_3px_0px_rgba(0,0,0,0.1)]"
              >
                {item.label}
              </button>
            ))}

            {user?.paymentStatus === "completed" ? (
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <button className="mt-1 w-full rounded-2xl border-[3px] border-black bg-pink-500 px-4 py-3 text-sm text-white shadow-[3px_3px_0px_rgba(0,0,0,0.12)]">
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <button className="mt-1 w-full rounded-2xl border-[3px] border-black bg-blue-400 px-4 py-3 text-sm text-black shadow-[3px_3px_0px_rgba(0,0,0,0.12)]">
                    Login
                  </button>
                </Link>

                <Link href="/register" onClick={() => setOpen(false)}>
                  <button className="mt-1 w-full rounded-2xl border-[3px] border-black bg-pink-400 px-4 py-3 text-sm text-black shadow-[3px_3px_0px_rgba(0,0,0,0.12)]">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}