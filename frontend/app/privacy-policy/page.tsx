"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Sparkles } from "lucide-react";

export default function PrivacyPolicy() {
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
              <ShieldCheck size={14} /> Privacy & Data Protection
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-600 sm:text-base">
              We are committed to protecting the privacy of students, parents, educators, and institutions. This policy explains how information is collected, used, stored, and protected across the Griduxa AI platform.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Effective Date</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{new Date().toISOString().split("T")[0]}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Data Responsibility</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">Secure, transparent, and limited</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Support</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">support@griduxa.in</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <p className="text-sm font-medium leading-7 text-slate-600 sm:text-base">
              Welcome to <span className="font-semibold text-slate-900">ai.griduxa.in</span>, operated by <span className="font-semibold text-slate-900">Griduxa Solutions LLP</span>. This platform is designed for learners, parents, and educators, and we prioritize safety, transparency, and responsible data usage.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <PolicyCard title="Information We Collect" color="bg-amber-50">
              <ul className="ml-5 list-disc space-y-2 text-sm leading-7 text-slate-600 sm:text-base">
                <li>Name, email address, and contact number</li>
                <li>Academic details such as class, school, college, and board</li>
                <li>Parent or guardian information where applicable</li>
                <li>Platform usage activity, test participation, and login data</li>
              </ul>
            </PolicyCard>

            <PolicyCard title="How We Use Data" color="bg-emerald-50">
              <ul className="ml-5 list-disc space-y-2 text-sm leading-7 text-slate-600 sm:text-base">
                <li>Create and manage user accounts</li>
                <li>Facilitate Olympiad participation and evaluations</li>
                <li>Support learning analytics and user assistance</li>
                <li>Improve platform performance and educational experience</li>
              </ul>
            </PolicyCard>

            <PolicyCard title="Data Sharing" color="bg-sky-50">
              <ul className="ml-5 list-disc space-y-2 text-sm leading-7 text-slate-600 sm:text-base">
                <li>We do not sell personal data</li>
                <li>Data may be shared with secure service providers when necessary</li>
                <li>Disclosure may occur only when legally required or necessary for safety</li>
              </ul>
            </PolicyCard>

            <PolicyCard title="Security Measures" color="bg-rose-50">
              <p className="flex items-start gap-2 text-sm leading-7 text-slate-600 sm:text-base">
                <Lock size={18} className="mt-0.5 shrink-0 text-slate-900" /> We use secure storage, controlled access, and practical safeguards to protect information. No digital system is completely risk-free, but we take privacy seriously.
              </p>
            </PolicyCard>

            <PolicyCard title="Cookies & Preferences" color="bg-violet-50">
              <p className="flex items-start gap-2 text-sm leading-7 text-slate-600 sm:text-base">
                <Eye size={18} className="mt-0.5 shrink-0 text-slate-900" /> Cookies help us remember preferences, improve usability, and understand engagement so the platform can remain helpful and efficient.
              </p>
            </PolicyCard>

            <PolicyCard title="Your Rights" color="bg-orange-50">
              <ul className="ml-5 list-disc space-y-2 text-sm leading-7 text-slate-600 sm:text-base">
                <li>Access your data</li>
                <li>Correct inaccuracies</li>
                <li>Request deletion of certain information</li>
                <li>Withdraw consent where applicable</li>
              </ul>
              <p className="mt-3 font-semibold text-slate-900">
                Contact: <a href="mailto:support@griduxa.in" className="underline">support@griduxa.in</a>
              </p>
            </PolicyCard>

            <PolicyCard title="Children’s Privacy" color="bg-red-50">
              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                We keep data collection minimal, encourage parent or guardian involvement for minors, and do not misuse student information.
              </p>
            </PolicyCard>

            <PolicyCard title="Policy Updates" color="bg-slate-100">
              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                This policy may change over time. Updates will be reflected here with the latest revision date so users remain informed.
              </p>
            </PolicyCard>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-slate-900" />
              <h2 className="text-xl font-black text-slate-900">Our Promise</h2>
            </div>
            <p className="text-sm font-medium leading-7 text-slate-600 sm:text-base">
              We believe privacy is a foundation of trust. Every interaction on the platform is handled with care, transparency, and respect for your learning journey.
            </p>
          </div>

          <div className="pt-2 text-center text-xs font-semibold text-slate-500 md:text-sm">
            © {new Date().getFullYear()} Griduxa Solutions LLP. All rights reserved.
          </div>
        </section>
      </div>
    </main>
  );
}

function PolicyCard({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  return (
    <div className={`rounded-[24px] border border-slate-200 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] ${color}`}>
      <h2 className="mb-3 text-lg font-black text-slate-900 md:text-xl">{title}</h2>
      <div className="text-sm font-medium leading-7 text-slate-700 md:text-base">{children}</div>
    </div>
  );
}