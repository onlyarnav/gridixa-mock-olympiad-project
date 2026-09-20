"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldAlert, BookOpen } from "lucide-react";

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f7f9fc_0%,#fdf8e9_100%)] font-sans text-slate-800">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/">
            <button className="flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white">
              <ArrowLeft size={16} strokeWidth={2.5} />
              Back
            </button>
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
            Griduxa Solutions LLP
          </span>
        </div>
      </div>

      <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="mx-auto mb-8 max-w-6xl">
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">
              <BookOpen size={14} /> Terms, Rules & Platform Usage
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Terms &amp; Conditions
            </h1>
            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-600 sm:text-base">
              Welcome to <span className="font-semibold text-slate-900">ai.griduxa.in</span>, operated by <span className="font-semibold text-slate-900">Griduxa Solutions LLP</span>. These terms govern your access to and use of the platform.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Last Updated</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{new Date().toISOString().split("T")[0]}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Jurisdiction</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">India</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Scope</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">Students, parents, educators</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <p className="text-sm font-medium leading-7 text-slate-600 sm:text-base">
              By accessing or using this platform, you agree to follow the terms below. These terms protect students, parents, educators, and the integrity of the AI Olympiad experience.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <TermCard title="1. Accurate Information" color="bg-amber-50">
              <p>You must provide truthful, complete, and up-to-date information while creating and maintaining an account.</p>
            </TermCard>

            <TermCard title="2. Account Responsibility" color="bg-emerald-50">
              <p>You are responsible for all activity performed through your account. Keep your credentials secure and do not share your login details.</p>
            </TermCard>

            <TermCard title="3. Responsible Use" color="bg-sky-50">
              <p>Cheating, copying answers, using unfair tools, or attempting to manipulate Olympiad outcomes is strictly prohibited.</p>
            </TermCard>

            <TermCard title="4. Intellectual Property" color="bg-rose-50">
              <p>All content, including questions, lessons, graphics, branding, and platform materials belongs to Griduxa Solutions LLP unless explicitly stated otherwise.</p>
            </TermCard>

            <TermCard title="5. Fees & Refunds" color="bg-orange-50">
              <p>If a paid service or registration fee applies, it is generally non-refundable unless a written exception is approved by Griduxa Solutions LLP.</p>
            </TermCard>

            <TermCard title="6. Platform Availability" color="bg-violet-50">
              <p>We aim to keep the platform available and reliable, but uninterrupted access cannot be guaranteed during maintenance, outages, or technical issues.</p>
            </TermCard>

            <TermCard title="7. Suspension & Termination" color="bg-red-50">
              <p>We may suspend or terminate accounts that violate these terms, compromise platform integrity, or misuse the service.</p>
            </TermCard>

            <TermCard title="8. Governing Law" color="bg-slate-100">
              <p>These terms are governed by the laws of India. Any disputes shall be handled under applicable Indian legal jurisdiction.</p>
            </TermCard>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-3 flex items-center gap-2">
              <ShieldAlert size={18} className="text-slate-900" />
              <h2 className="text-xl font-black text-slate-900">Important Notice for Students & Parents</h2>
            </div>
            <ul className="ml-5 list-disc space-y-2 text-sm font-medium leading-7 text-slate-600 sm:text-base">
              <li>Students should use the platform responsibly and honestly.</li>
              <li>Parents or guardians are encouraged to review account details for minors.</li>
              <li>Access may be restricted if activity is found harmful, abusive, or unfair.</li>
            </ul>
          </div>

          <div className="pt-2 text-center text-xs font-semibold text-slate-500 md:text-sm">
            © {new Date().getFullYear()} Griduxa Solutions LLP. All rights reserved.
          </div>
        </section>
      </div>
    </main>
  );
}

function TermCard({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  return (
    <div className={`rounded-[24px] border border-slate-200 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] ${color}`}>
      <h2 className="mb-3 text-lg font-black text-slate-900 md:text-xl">{title}</h2>
      <div className="text-sm font-medium leading-7 text-slate-700 md:text-base">{children}</div>
    </div>
  );
}