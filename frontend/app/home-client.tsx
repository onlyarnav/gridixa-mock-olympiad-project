"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Trophy,
  BookOpen,
  Target,
  ChevronDown,
  HelpCircle,
  Gift,
  FileCheck,
  Landmark,
  Zap,
  Star,
  Sparkles,
  Rocket,
  School,
  TrendingUp,
  Users,
  Medal,
  Crown,
  Award,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 🔥 Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Enhanced animation variants
const float = {
  initial: { y: 0 },
  animate: {
    y: [-20, 20, -20],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const pulse = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 3,
      repeat: Infinity,
    },
  },
};

const rotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear" as const,
    },
  },
};

const partnerLogos = [
  { name: "MentorX", image: "/partners/MentorX.png" },
  { name: "RevUp Life Skills", image: "/partners/Revup.jpg" },
  { name: "Nancy Juneja", image: "/partners/NJ.png"},
  {
    name: "Lucknow Public College of Professional Studies",
    image: "/partners/LPCPS.png",
  },
  {
    name: "Global Institute of Technology and Management",
    image: "/partners/GITM.png",
  },

  {
    name: "Vivekananda Institute of Professional Studies (VIPS), IPU",
    image: "/partners/VIPS.png",
  },
  {
    name: "Guru Tegh Bahadur Institute of Technology (GTBIT), IPU",
    image: "/partners/GTBIT.png",
  },
  {
    name: "JMIT Radaur",
    image: "/partners/JMIT.png",
  },
  {
    name: "P.G.D.A.V. College, University of Delhi",
    image: "/partners/PGDAV.png",
  },
  {
    name: "Atma Ram Sanatan Dharma College (ARSD), University of Delhi",
    image: "/partners/ARSD.png",
  },
  {
    name: "Jamia Hamdard University",
    image: "/partners/JamiaHamdard.png",
  },
];

const PartnerLogo = ({ partner }: { partner: { name: string; image: string } }) => {
  const [hasImage, setHasImage] = useState(true);

  return (
    <div className="flex h-24 w-[180px] min-w-[180px] items-center justify-center rounded-2xl border border-black/10 bg-white/90 px-4 shadow-[4px_4px_0px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:h-28 sm:w-[220px] sm:min-w-[220px]">
      {hasImage ? (
        <img
          src={partner.image}
          alt={`${partner.name} logo`}
          loading="lazy"
          className="max-h-12 w-full object-contain sm:max-h-16"
          onError={() => setHasImage(false)}
        />
      ) : (
        <div className="flex flex-col items-center text-center">
          <span className="text-sm font-black uppercase tracking-[0.25em] text-slate-700">
            {partner.name}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">
            Partner
          </span>
        </div>
      )}
    </div>
  );
};

// Floating Elements Component
const FloatingElements = () => {
  const elements = [
    { icon: Brain, color: "text-pink-500", top: "10%", left: "5%", delay: 0 },
    { icon: Zap, color: "text-yellow-500", top: "15%", right: "8%", delay: 0.5 },
    { icon: Star, color: "text-blue-500", top: "60%", left: "8%", delay: 1 },
    { icon: Sparkles, color: "text-purple-500", top: "70%", right: "5%", delay: 1.5 },
    { icon: Trophy, color: "text-green-500", top: "25%", right: "15%", delay: 0.8 },
  ];

  return (
    <>
      {elements.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ delay: item.delay }}
            className={`absolute ${item.color}`}
            style={{ top: item.top, left: item.left, right: item.right }}
          >
            <motion.div
              variants={float}
              initial="initial"
              animate="animate"
            >
              <Icon size={48} strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Animated circles in background */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-10 blur-3xl"
        variants={pulse}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-32 right-10 w-40 h-40 bg-pink-400 rounded-full opacity-10 blur-3xl"
        variants={pulse}
        animate="animate"
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-36 h-36 bg-yellow-300 rounded-full opacity-5 blur-3xl"
        variants={rotate}
        animate="animate"
      />
    </>
  );
};

// --- LOADING ANIMATION ---
const NeuralAnimation = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-blue-400 font-mono"
        >
          <div className="relative h-[300px] w-[300px] flex items-center justify-center">
            <div className="absolute inset-0 border-[6px] border-black bg-yellow-400 shadow-[10px_10px_0px_black]" />

            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 opacity-40">
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                  className="border border-black"
                />
              ))}
            </div>

            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-0 h-2 w-full bg-black opacity-20"
            />

            <div className="z-10 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-2xl font-black uppercase text-black md:text-3xl"
              >
                AI OLYMPIAD
              </motion.h2>

              <motion.p
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                className="mt-2 text-sm font-bold tracking-widest text-black"
              >
                LOADING MODULE...
              </motion.p>

              <div className="mx-auto mt-4 h-3 w-40 overflow-hidden border-2 border-black bg-white">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="h-full w-1/2 bg-black"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Tagline Section Component with Interactive Tooltips
const TaglineSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items = [
    { emoji: "✨", text: "Learn AI", fullText: "Learn Artificial Intelligence from basics to advanced" },
    { emoji: "🎯", text: "Practice Tests", fullText: "Practice with real tests & competitions" },
    { emoji: "🏆", text: "Win Rewards", fullText: "Compete at Olympiad level & win rewards" },
  ];

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay: 0.4 }}
      className="mx-auto mt-8 border-l-[6px] border-black bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 text-left font-black shadow-lg hover:shadow-xl transition-all"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto md:overflow-visible relative"
      >
        {items.map((item, idx) => (
          <div key={idx} className="relative">
            <motion.div
              className="flex items-center gap-1 sm:gap-2 whitespace-nowrap flex-shrink-0 group cursor-pointer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              onHoverStart={() => setHoveredIndex(idx)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <motion.span
                className="text-lg sm:text-xl md:text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ 
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 3,
                  delay: idx * 0.2
                }}
              >
                {item.emoji}
              </motion.span>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                {item.text}
              </span>
              {idx < 2 && (
                <motion.div
                  className="w-1 h-4 sm:h-5 md:h-6 bg-black group-hover:bg-blue-600 transition-colors mx-1 sm:mx-2 flex-shrink-0"
                  whileHover={{ scaleX: 1.5 }}
                />
              )}
            </motion.div>

            {/* Individual Tooltip */}
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: -50, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 whitespace-nowrap"
                >
                  <div className="bg-black text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-lg border-2 border-yellow-400">
                    {item.fullText}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const faqItems = [
  {
    q: "Who can join the AI Olympiad?",
    a: "Students from Class 6 to 12 and college Years 1 to 4 are eligible to participate, with level-based learning designed for every stage.",
  },
  {
    q: "What do I get after registering?",
    a: "You get access to structured AI learning, practice tests, performance tracking, and eligibility for the Olympiad exam.",
  },
  {
    q: "Is the program suitable for beginners?",
    a: "Yes. It starts from the basics and gradually moves into practical AI concepts, so even first-time learners can follow comfortably.",
  },
  {
    q: "How are the tests structured?",
    a: "There are topic, chapter, and module-level tests designed to help students practice step by step and improve before the final Olympiad.",
  },
  {
    q: "Will I receive a certificate?",
    a: "Yes. Certificates are provided for participants, and top performers receive additional cash prizes, recognition and rewards.",
  },
  {
    q: "How do I reset my password later?",
    a: "Log out and use the Forgot Password option on the login page. You will get the OTP flow there to set a new password.",
  },
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="scroll-mt-28 border-y-[6px] border-black bg-white py-20 px-4 sm:px-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-[4px] border-black bg-yellow-400 shadow-[4px_4px_0px_black]">
            <HelpCircle size={28} />
          </div>
          <h2 className="text-4xl font-black uppercase md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-relaxed text-black/70 md:text-base">
            Quick answers to the most common questions about registration,
            learning, tests, and support.
          </p>
        </div>

        <div className="grid gap-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={item.q}
                layout
                className={[
                  "border-[4px] border-black bg-[#fff9e6] shadow-[6px_6px_0px_black]",
                  isOpen ? "bg-yellow-100" : "bg-white",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5 text-left"
                >
                  <span className="text-sm font-black uppercase tracking-tight sm:text-base">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 border-[3px] border-black bg-pink-400 p-1 shadow-[3px_3px_0px_black]"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 pt-0 sm:px-5">
                        <div className="border-l-[5px] border-black bg-white px-4 py-4 text-sm font-bold leading-relaxed sm:text-base">
                          {item.a}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");

    if (!hasSeenIntro) {
      setShowIntro(true);
      const timer = setTimeout(() => setShowIntro(false), 2500);
      sessionStorage.setItem("hasSeenIntro", "true");
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  if (!mounted) return <div className="min-h-screen bg-[#fff9e6]" />;

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            exit={{ y: "-100%" }}
            className="fixed inset-0 z-[100] flex items-center justify-center border-b-[10px] border-black bg-blue-500"
          >
            <NeuralAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-[#fff9e6] font-mono text-black">
        <Header />

        {/* HERO */}
        <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden border-b-[6px] border-black px-4 py-16 text-center sm:px-6 sm:py-20 md:py-24 bg-gradient-to-b from-blue-50 via-white to-yellow-50">
          {/* Floating elements */}
          <FloatingElements />
          <div
            className="pointer-events-none absolute inset-0 opacity-5"
            style={{
              backgroundImage: "radial-gradient(#000 2px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="z-10 w-full max-w-5xl"
          >
            {/* Animated top badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 border-2 border-blue-600 bg-blue-100 px-4 py-2 rounded-full font-bold text-blue-700"
            >
              <Sparkles size={16} />
              India's Premier AI Competition
              <Sparkles size={16} />
            </motion.div>

            {/* Main heading with enhanced styling */}
            <motion.h1 
              className="text-4xl font-black uppercase leading-[0.9] break-words sm:text-6xl md:text-8xl mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              INDIA'S FIRST <br />
              <motion.span
                whileHover={{ 
                  scale: 1.05,
                  rotate: -1,
                  boxShadow: "8px 8px 0px rgba(0,0,0,0.3)"
                }}
                className="mt-4 inline-block border-[4px] border-black bg-gradient-to-r from-yellow-300 to-yellow-400 px-4 text-black shadow-[6px_6px_0px_black] sm:px-6 md:border-[6px] md:px-8 relative"
              >
                <motion.div
                  className="absolute -top-4 -right-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity }}
                >
                  <Star size={24} className="text-yellow-600 fill-yellow-600" />
                </motion.div>
                AI OLYMPIAD
                <motion.div
                  className="absolute -bottom-4 -left-4"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity }}
                >
                  <Zap size={24} className="text-blue-600 fill-blue-600" />
                </motion.div>
              </motion.span>
            </motion.h1>

            {/* Animated tagline - Interactive Single Line */}
            <TaglineSection />

            {/* Stats showcase */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.6 }}
              className="mt-10 flex justify-center gap-6 sm:gap-8 flex-wrap"
            >
              {[
                { label: "10,000+", desc: "Students" },
                { label: "200+", desc: "Schools" },
                { label: "₹20,000+", desc: "Prizes" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] transition-all"
                >
                  <div className="text-sm font-black text-blue-600 uppercase">{stat.desc}</div>
                  <div className="text-xl font-black">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA buttons with enhanced styling */}
            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:mt-14 sm:flex-row">
              <Link href="/register" className="w-full sm:w-auto">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ y: -4 }}
                  className="group relative w-full bg-gradient-to-r from-blue-600 to-blue-700 border-[3px] border-black px-8 py-4 text-lg font-black uppercase tracking-tighter text-white transition-colors hover:from-yellow-400 hover:to-yellow-500 hover:text-black sm:w-auto md:px-12 md:py-6 md:text-2xl shadow-lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    🚀 Start for ₹199
                  </span>
                  <motion.div 
                    className="absolute inset-0 -z-10 translate-x-2 translate-y-2 border-[3px] border-black bg-yellow-400 transition-transform duration-200 group-hover:translate-x-0 group-hover:translate-y-0 md:border-[4px]" 
                  />
                </motion.button>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-3 text-sm text-black/70 font-bold"
                >
                  Exclusive of GST • Limited slots available
                </motion.p>
              </Link>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden sm:block"
              >
                <Link href="#faqs" className="inline-flex items-center gap-2 border-[3px] border-black bg-pink-400 px-6 py-4 font-bold uppercase text-black shadow-lg hover:shadow-xl transition-all">
                  Learn More →
                </Link>
              </motion.div>
            </div>

            {/* Animated scroll indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-12"
            >
              <ChevronDown className="mx-auto text-black" size={32} strokeWidth={3} />
            </motion.div>
          </motion.div>
        </section>

        <section className="border-2 border-black bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_40%),linear-gradient(135deg,#f8fbff_0%,#fffdf5_100%)] px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-7xl"
          >
            <div className="mb-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[32px] border-[4px] border-black bg-white p-6 shadow-[10px_10px_0px_rgba(0,0,0,0.12)] sm:p-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow-300 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-black">
                  <Sparkles size={14} /> Advisory Board <Sparkles size={14} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
                  Dr. Nancy Juneja
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-black/70 sm:text-base">
                  A distinguished education leader, entrepreneur, and mentor, Dr. Nancy Juneja brings extensive experience across education, innovation, entrepreneurship, and youth development. As the Founder of RevUp Life Skills, Co-Founder of MENTORx, CEO of LUCR8 Ventures, and Principal of Shanti Gyan Vidyapeeth School, she has played a pivotal role in shaping future-ready learning initiatives. Her contributions as a mentor with NITI Aayog, the Ministry of Education, and other national and international platforms add valuable strategic insight and credibility to our movement.
                </p>
                <blockquote className="mt-5 rounded-2xl border-2 border-black bg-[#f8fbff] p-4 text-sm font-black italic leading-7 text-black shadow-[4px_4px_0px_rgba(0,0,0,0.08)] sm:text-base">
                  “The future belongs to learners who are prepared to create, lead, and solve problems with confidence and purpose.”
                </blockquote>
              </div>

              <div className="relative overflow-hidden rounded-[32px] border-[4px] border-black bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_30%),linear-gradient(135deg,#fef3c7_0%,#eff6ff_100%)] p-4 shadow-[10px_10px_0px_rgba(0,0,0,0.12)] sm:p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.9)_0%,_transparent_55%)]" />
                <img
                  src="/nancy_juneja.png"
                  alt="Dr. Nancy Juneja"
                  className="relative mx-auto h-[320px] w-full max-w-[280px] rounded-[24px] border-[4px] border-black object-cover shadow-[8px_8px_0px_rgba(0,0,0,0.12)] sm:h-[360px] sm:max-w-[320px]"
                />
                <div className="relative mt-4 rounded-2xl border-2 border-black bg-white/90 p-4 text-sm font-bold leading-7 text-black shadow-[4px_4px_0px_rgba(0,0,0,0.08)]">
                  Her leadership reinforces the value of structured AI education, entrepreneurship, and confidence-building for students, schools, and colleges.
                </div>
              </div>
            </div>

            <div className="mb-5 flex flex-col items-center text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow-300 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-black shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
                <Sparkles size={14} />
                Our Partners
                <Sparkles size={14} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
                Trusted by learners, schools, and innovation communities
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold text-black/70 sm:text-base">
                Our ecosystem grows stronger with partners who believe in skill-first learning and future-ready AI education.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white/80 p-3 shadow-[0_12px_35px_rgba(0,0,0,0.08)] backdrop-blur sm:p-5">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white via-white/80 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white via-white/80 to-transparent" />
              <div className="flex w-max items-center gap-3 sm:gap-4" style={{ animation: "partners-scroll 20s linear infinite" }}>
                {[...partnerLogos, ...partnerLogos].map((partner, index) => (
                  <PartnerLogo key={`${partner.name}-${index}`} partner={partner} />
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <style jsx global>{`
          @keyframes partners-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        {/* FEATURES */}
        <section className="border-t border-b border-black scroll-mt-28 border-b border-black bg-blue-600 px-4 py-20 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-6xl"
          >
            <h2 className="mb-12 text-center text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
              What You'll Get
            </h2>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4"
            >
              {[
                {
                  icon: Brain,
                  title: "AI Learning",
                  desc: "Structured syllabus from basics to advanced AI",
                  number: "01",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: BookOpen,
                  title: "Notes + Videos",
                  desc: "Concept clarity with topic-wise learning",
                  number: "02",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Target,
                  title: "Practice Tests",
                  desc: "Topic, chapter, and module-level tests",
                  number: "03",
                  color: "from-yellow-400 to-orange-500"
                },
                {
                  icon: Trophy,
                  title: "Olympiad Level",
                  desc: "Compete at national-level standards",
                  number: "04",
                  color: "from-green-400 to-emerald-500"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group relative border-4 border-black bg-white p-6 shadow-[6px_6px_0px_black] hover:shadow-[10px_10px_0px_black] transition-all duration-300"
                >
                  {/* Number Badge */}
                  <motion.div
                    className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r ${item.color} border-4 border-black rounded-full flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="font-black text-white text-lg">{item.number}</span>
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="mb-4 inline-block p-3 bg-blue-100 border-2 border-black rounded-lg"
                  >
                    <item.icon className="mb-0 h-8 w-8 text-blue-600" />
                  </motion.div>

                  <h3 className="mb-2 text-xl font-black uppercase group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm font-bold text-black/80">{item.desc}</p>

                  {/* Bottom accent */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.color}`}
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* WHY AI OLYMPIAD */}
        <section
          id="about"
          className="scroll-mt-28 bg-[#fff9e6] py-24 px-4 sm:px-6 overflow-hidden relative"
        >
          {/* background blobs */}

          <motion.div
            className="absolute top-10 left-10 w-40 h-40 bg-blue-400 opacity-10 blur-3xl rounded-full"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
          />

          <motion.div
            className="absolute bottom-10 right-10 w-52 h-52 bg-pink-400 opacity-10 blur-3xl rounded-full"
            animate={{
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
          />

          <div className="mx-auto max-w-7xl">

            {/* Header */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 border-4 border-black bg-yellow-400 px-5 py-2 shadow-[6px_6px_0px_black] font-black uppercase mb-6">

                <Sparkles size={20} />

                Why AI Olympiad?

              </div>

              <h2 className="text-4xl md:text-6xl font-black uppercase">

                Turning AI Learning Into A

                <span className="block text-blue-600">

                  National Movement

                </span>

              </h2>

              <p className="max-w-3xl mx-auto mt-6 text-lg font-bold text-black/70">

                AI shouldn't be expensive, confusing or inaccessible.

                We built a structured pathway where every student can

                learn, practice, compete and get nationally recognized.

              </p>
            </motion.div>


            {/* Problem */}

            <div className="mb-16">

              <h3 className="text-center text-2xl md:text-3xl font-black uppercase mb-10">

                ❌ Current Challenges

              </h3>

              <div className="grid md:grid-cols-3 gap-8">

                {[
                  {
                    icon: School,
                    title:"No Structured Curriculum",
                    desc:"Most schools still don't have a complete AI roadmap."
                  },

                  {
                    icon: TrendingUp,
                    title:"No Progress Tracking",
                    desc:"Students cannot benchmark themselves nationally."
                  },

                  {
                    icon: Users,
                    title:"Limited Access",
                    desc:"AI programs are expensive and available to very few."
                  }

                ].map((item,i)=>{

                  const Icon=item.icon;

                  return(

                    <motion.div
                      key={i}
                      whileHover={{
                        y:-10,
                        scale:1.04
                      }}
                      className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_black]"
                    >

                      <div className="inline-flex p-4 border-4 border-black bg-red-100 mb-5">

                        <Icon size={30} />

                      </div>

                      <h4 className="text-2xl font-black mb-3">

                        {item.title}

                      </h4>

                      <p className="font-bold text-black/70">

                        {item.desc}

                      </p>

                    </motion.div>

                  );
                })}
              </div>
            </div>


            {/* Center Solution Card */}

            <motion.div
              whileHover={{
                scale:1.02
              }}
              className="relative border-[6px] border-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 p-10 shadow-[12px_12px_0px_black] mb-16"
            >

              <div className="absolute -top-7 right-8 w-16 h-16 rounded-full border-4 border-black bg-blue-600 flex items-center justify-center">

                <Brain className="text-white" size={28}/>

              </div>

              <h3 className="text-4xl font-black uppercase mb-5">

                ⚡ Our Solution

              </h3>

              <p className="font-bold text-lg max-w-4xl mb-8">

                AI Olympiad combines structured learning, practice tests,

                analytics and national competition into one journey.

              </p>

              <div className="grid md:grid-cols-3 gap-6">

                {[
                  "Level-based syllabus",

                  "Monthly assessments",

                  "National leaderboard",

                  "Certificates",

                  "Rewards & prizes",

                  "Industry-ready AI skills"

                ].map((item,i)=>(

                  <div
                    key={i}
                    className="flex items-center gap-3 border-3 border-black bg-white px-4 py-4 font-black"
                  >

                    <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white border-2 border-black">

                      ✓

                    </div>

                    {item}

                  </div>

                ))}

              </div>

            </motion.div>


            {/* Results */}

            <div>

              <h3 className="text-center text-2xl md:text-3xl font-black uppercase mb-10">

                🏆 What Students Achieve

              </h3>

              <div className="grid md:grid-cols-3 gap-8">

                {[
                  {
                    icon:Brain,
                    title:"AI Mastery",
                    color:"bg-blue-500",
                    desc:"Build future-ready AI skills."
                  },

                  {
                    icon:Target,
                    title:"Competition Ready",
                    color:"bg-pink-500",
                    desc:"Benchmark yourself nationally."
                  },

                  {
                    icon:Trophy,
                    title:"Recognition",
                    color:"bg-green-500",
                    desc:"Certificates, rewards & scholarships."
                  }

                ].map((item,i)=>{

                  const Icon=item.icon;

                  return(

                    <motion.div
                      key={i}
                      whileHover={{
                        y:-12,
                        scale:1.05
                      }}
                      className="relative border-4 border-black bg-white p-8 shadow-[8px_8px_0px_black]"
                    >

                      <div className={`w-16 h-16 ${item.color}
                      border-4 border-black rounded-full flex items-center justify-center mb-6`}>

                        <Icon
                          size={28}
                          className="text-white"
                        />

                      </div>

                      <h4 className="text-2xl font-black mb-3">

                        {item.title}

                      </h4>

                      <p className="font-bold text-black/70">

                        {item.desc}

                      </p>

                    </motion.div>

                  );
                })}
              </div>
            </div>


            {/* CTA */}

            <div className="text-center mt-20">

              <Link href="/register">

                <motion.button
                  whileHover={{
                    y:-4
                  }}
                  whileTap={{
                    scale:0.95
                  }}
                  className="border-4 border-black bg-pink-500 px-10 py-5 text-white text-xl font-black uppercase shadow-[8px_8px_0px_black] hover:bg-yellow-400 hover:text-black transition-all"
                >

                  🚀 Join The Olympiad

                </motion.button>

              </Link>

            </div>

          </div>
        </section>

        {/* PROGRAM STRUCTURE */}
        <section id="structure" className="scroll-mt-28 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-18 mb-20 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-6xl"
          >
            <h2 className="mb-16 text-center text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white">
              Learning Journey
            </h2>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-8 md:grid-cols-3 relative"
            >
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-yellow-400 to-pink-400 z-0" />

              {[
                {
                  title: "Phase 1",
                  subtitle: "Learning",
                  desc: "AI basics, ML concepts, ethics, and real-world applications",
                  icon: BookOpen,
                  color: "from-blue-500 to-blue-600",
                  duration: "Start Here"
                },
                {
                  title: "Phase 2",
                  subtitle: "Practice",
                  desc: "Mock tests, topic quizzes, performance analytics",
                  icon: Target,
                  color: "from-yellow-400 to-orange-500",
                  duration: "Build Skills"
                },
                {
                  title: "Phase 3",
                  subtitle: "Olympiad Exam",
                  desc: "National level exam with leaderboard rankings",
                  icon: Trophy,
                  color: "from-pink-500 to-red-500",
                  duration: "Compete & Win"
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ y: -12, scale: 1.05 }}
                    className="relative z-10"
                  >
                    <div className="flex flex-col items-center">
                      {/* Step circle */}
                      <motion.div
                        className={`w-16 h-16 rounded-full border-4 border-black bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 shadow-[4px_4px_0px_black] text-white font-black text-2xl`}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      >
                        {i + 1}
                      </motion.div>

                      {/* Card */}
                      <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_black] w-full text-center relative">
                        <motion.div
                          className="inline-block p-2 bg-yellow-200 border-2 border-black rounded mb-3"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                        >
                          <Icon className="h-6 w-6 text-blue-600" />
                        </motion.div>

                        <h3 className="text-2xl font-black uppercase mb-1">{item.title}</h3>
                        <h4 className="mb-3 text-xl font-black text-blue-600">{item.subtitle}</h4>
                        <p className="font-bold text-sm mb-4">{item.desc}</p>

                        <motion.div
                          className="inline-block border-2 border-black bg-blue-100 px-3 py-1 rounded-full text-xs font-black text-blue-700"
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.duration}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Timeline caption */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <p className="font-black text-sm text-white uppercase tracking-widest">
                Complete all phases to unlock Olympiad eligibility ✨
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* SYLLABUS */}
        <section
          id="syllabus"
          className="scroll-mt-28 bg-gradient-to-b from-[#fff9e6] to-white px-4 pb-20 sm:px-6"
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-6xl"
          >
            <h2 className="mx-auto mb-4 inline-block border-4 border-black bg-white px-6 py-2 text-3xl sm:text-4xl md:text-5xl font-black uppercase text-center block w-full">
              Syllabus By Level
            </h2>
            <p className="text-center text-sm font-bold text-black/60 mb-12">Choose your level and master AI step by step</p>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* School Level */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
              >
                {[
                  {
                    title: "Class 6–8",
                    desc: "Introduction to AI, basic concepts, logic building",
                    level: "Beginner",
                    emoji: "🌱",
                    color: "from-green-400 to-emerald-500"
                  },
                  {
                    title: "Class 9–10",
                    desc: "Machine Learning basics, real-world applications",
                    level: "Intermediate",
                    emoji: "🌿",
                    color: "from-blue-400 to-cyan-500"
                  },
                  {
                    title: "Class 11–12",
                    desc: "Advanced AI, neural networks, projects",
                    level: "Advanced",
                    emoji: "🚀",
                    color: "from-purple-500 to-pink-500"
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ y: -8, scale: 1.04 }}
                    className="group border-4 border-black bg-white p-6 shadow-[6px_6px_0px_black] hover:shadow-[10px_10px_0px_black] transition-all relative overflow-hidden"
                  >
                    {/* Background accent */}
                    <motion.div
                      className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r ${item.color} opacity-10 rounded-full`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-4xl">{item.emoji}</span>
                        <motion.div
                          className={`px-3 py-1 bg-gradient-to-r ${item.color} text-white text-xs font-black rounded-full`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.level}
                        </motion.div>
                      </div>

                      <h3 className="mb-2 text-2xl font-black group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <p className="font-bold text-sm mb-4">{item.desc}</p>

                      {/* Progress indicator */}
                      <div className="w-full bg-gray-200 h-2 border-2 border-black overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${item.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${60 + i * 15}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* College Level */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                {[
                  {
                    title: "Year 1–2",
                    desc: "Foundations: programming, data, math, and mini projects",
                    level: "Foundation",
                    emoji: "📚",
                    color: "from-yellow-400 to-orange-500"
                  },
                  {
                    title: "Year 3–4",
                    desc: "Advanced: ML, evaluation, deployment, and research methods",
                    level: "Expert",
                    emoji: "🔬",
                    color: "from-red-500 to-pink-600"
                  },
                ].map((item, i) => (
                  <motion.div
                    key={`year-${i}`}
                    variants={fadeUp}
                    whileHover={{ y: -8, scale: 1.04 }}
                    className="group border-4 border-black bg-white p-6 shadow-[6px_6px_0px_black] hover:shadow-[10px_10px_0px_black] transition-all relative overflow-hidden"
                  >
                    {/* Background accent */}
                    <motion.div
                      className={`absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-r ${item.color} opacity-10 rounded-full`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-4xl">{item.emoji}</span>
                        <motion.div
                          className={`px-3 py-1 bg-gradient-to-r ${item.color} text-white text-xs font-black rounded-full`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.level}
                        </motion.div>
                      </div>

                      <h3 className="mb-2 text-2xl font-black group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <p className="font-bold text-sm mb-4">{item.desc}</p>

                      {/* Progress indicator */}
                      <div className="w-full bg-gray-200 h-2 border-2 border-black overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${item.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${75 + i * 15}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-12"
            >
              <p className="font-black text-sm text-black/60 uppercase tracking-widest mb-4">
                📖 All levels available with live classes & recorded sessions
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* REWARDS */}
        <section
          id="rewards"
          className="scroll-mt-28 relative overflow-hidden bg-blue-600 py-24 px-4 sm:px-6"
        >
          {/* background blobs */}

          <motion.div
            className="absolute top-20 left-10 w-56 h-56 bg-yellow-400 opacity-10 blur-3xl rounded-full"
            animate={{
              scale:[1,1.2,1]
            }}
            transition={{
              duration:6,
              repeat:Infinity
            }}
          />

          <motion.div
            className="absolute bottom-10 right-10 w-72 h-72 bg-pink-400 opacity-10 blur-3xl rounded-full"
            animate={{
              scale:[1.2,1,1.2]
            }}
            transition={{
              duration:7,
              repeat:Infinity
            }}
          />

          <div className="mx-auto max-w-7xl relative z-10">

            {/* Heading */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once:true }}
              className="text-center mb-20"
            >

              <div className="inline-flex items-center gap-2 border-4 border-black bg-yellow-400 px-6 py-3 shadow-[8px_8px_0px_black] font-black uppercase mb-6">

                <Sparkles size={18} />

                Rewards & Recognition

              </div>

              <h2 className="text-5xl md:text-7xl font-black uppercase text-white">

                Compete.

                <span className="block">

                  Learn.

                </span>

                <span className="block text-yellow-300">

                  Get Rewarded.

                </span>

              </h2>

            </motion.div>


            {/* reward cards */}

            <div className="grid md:grid-cols-3 gap-8 mb-20">

              {[
                {
                  icon:Crown,
                  title:"Champions",
                  badge:"🥇",
                  color:"bg-yellow-400",
                  desc:"Cash prizes & scholarships for top national ranks.",

                  perks:[
                    "Cash rewards",
                    "Scholarships",
                    "Internships"
                  ]
                },

                {
                  icon:Gift,
                  title:"Top Performers",
                  badge:"🥈",
                  color:"bg-pink-400",

                  desc:"Exclusive goodies and AI Olympiad merchandise.",

                  perks:[
                    "T-Shirts",
                    "Premium goodies",
                    "Special gifts"
                  ]
                },

                {
                  icon:FileCheck,
                  title:"Every Participant",
                  badge:"🥉",
                  color:"bg-cyan-300",

                  desc:"Receive official certificates and recognition.",

                  perks:[
                    "Digital certificate",
                    "Participation proof",
                    "Achievement badge"
                  ]
                }

              ].map((item,i)=>{

                const Icon=item.icon;

                return(

                  <motion.div

                    key={i}

                    whileHover={{
                      y:-12,
                      scale:1.04
                    }}

                    className={`relative border-4 border-black ${item.color}
                    p-8 shadow-[10px_10px_0px_black] overflow-hidden`}
                  >

                    {/* badge */}

                    <div className="absolute top-5 right-5 text-4xl">

                      {item.badge}

                    </div>

                    <motion.div

                      animate={{
                        rotate:[0,8,-8,0]
                      }}

                      transition={{
                        duration:4,
                        repeat:Infinity
                      }}

                      className="inline-flex p-4 border-4 border-black bg-white mb-6"
                    >

                      <Icon size={30} />

                    </motion.div>

                    <h3 className="text-3xl font-black uppercase mb-3">

                      {item.title}

                    </h3>

                    <p className="font-bold mb-6">

                      {item.desc}

                    </p>

                    <div className="space-y-3">

                      {item.perks.map((perk,j)=>(

                        <div

                          key={j}

                          className="flex items-center gap-3 bg-white border-2 border-black px-4 py-3 font-black"
                        >

                          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white border-2 border-black">

                            ✓

                          </div>

                          {perk}

                        </div>

                      ))}

                    </div>

                  </motion.div>

                )

              })}

            </div>


            {/* bottom CTA */}

            <motion.div

              whileHover={{
                scale:1.02
              }}

              className="border-[6px] border-black bg-gradient-to-r from-pink-500 to-purple-500 p-10 shadow-[12px_12px_0px_black] text-center"
            >

              <Trophy

                size={60}

                className="mx-auto text-yellow-300 mb-5"
              />

              <h3 className="text-4xl font-black uppercase text-white mb-4">

                National Recognition Awaits

              </h3>

              <p className="font-bold text-white text-lg mb-8">

                Every participant walks away with achievements.

                The best performers become national AI champions.

              </p>

              <Link href="/register">

                <motion.button

                  whileTap={{
                    scale:0.95
                  }}

                  className="border-4 border-black bg-yellow-400 px-10 py-5 text-xl font-black uppercase shadow-[8px_8px_0px_black] hover:bg-white"
                >

                  🚀 Start Competing

                </motion.button>

              </Link>

            </motion.div>

          </div>

        </section>

        {/* IMPACT */}
        <section className="bg-white px-4 py-24 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-6xl"
          >
            <h2 className="mb-4 text-center text-3xl sm:text-4xl md:text-5xl font-black uppercase">
              We're Growing Nationwide
            </h2>
            <p className="text-center text-sm font-bold text-black/60 mb-12 uppercase tracking-widest">
              Join thousands of students achieving their AI dreams
            </p>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-4"
            >
              {[
                { label: "Students", value: "10,000", suffix: "+", icon: "👨‍🎓", color: "from-blue-500 to-cyan-500" },
                { label: "Schools", value: "200", suffix: "+", icon: "🏫", color: "from-green-500 to-emerald-500" },
                { label: "Colleges", value: "50", suffix: "+", icon: "🎓", color: "from-purple-500 to-pink-500" },
                { label: "Reach", value: "Pan India", suffix: "", icon: "🌍", color: "from-yellow-500 to-orange-500" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -12, scale: 1.08 }}
                  className="relative border-4 border-black bg-gradient-to-br from-white to-gray-50 p-6 shadow-[6px_6px_0px_black] hover:shadow-[10px_10px_0px_black] transition-all group overflow-hidden"
                >
                  {/* Gradient background accent */}
                  <motion.div
                    className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r ${item.color} opacity-10 rounded-full`}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                  />

                  <div className="relative z-10 text-center">
                    <motion.span
                      className="text-5xl"
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    >
                      {item.icon}
                    </motion.span>

                    <motion.h4
                      className="font-black uppercase text-sm text-black/60 mt-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      {item.label}
                    </motion.h4>

                    <motion.div
                      className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent mt-2`}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                    >
                      {item.value}
                      <span className="text-2xl">{item.suffix}</span>
                    </motion.div>

                    {/* Achievement badge */}
                    <motion.div
                      className={`mt-4 inline-block px-3 py-1 bg-gradient-to-r ${item.color} text-white text-xs font-black rounded-full`}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    >
                      ✓ Verified
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* APPLIED SKILLS */}
        <section className="bg-gradient-to-r from-pink-400 to-red-400 px-4 py-24 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-6xl"
          >
            <h2 className="mb-4 text-center text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
              Skills You'll Master
            </h2>
            <p className="text-center text-sm font-bold text-white/90 mb-12 uppercase tracking-widest">
              Industry-ready skills for your career
            </p>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {[
                {
                  icon: "🤖",
                  title: "ML & AI",
                  skills: ["Supervised Learning", "Unsupervised Learning", "Deep Learning", "Neural Networks"],
                  color: "from-purple-500 to-blue-500"
                },
                {
                  icon: "📊",
                  title: "Data Science",
                  skills: ["Data Analysis", "Data Visualization", "Statistical Methods", "Business Insights"],
                  color: "from-yellow-400 to-orange-500"
                },
                {
                  icon: "💻",
                  title: "Programming",
                  skills: ["Python Mastery", "Algorithm Design", "Problem Solving", "Code Optimization"],
                  color: "from-green-500 to-emerald-500"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -12, scale: 1.05 }}
                  className="group relative border-4 border-black bg-white p-8 shadow-[6px_6px_0px_black] hover:shadow-[10px_10px_0px_black] transition-all overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5`}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className="text-5xl mb-4"
                      animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    >
                      {item.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className="mb-4 text-2xl font-black uppercase">
                      {item.title}
                    </h3>

                    {/* Skills with badges */}
                    <div className="space-y-2 mb-4">
                      {item.skills.map((skill, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + j * 0.1 }}
                          className="flex items-center gap-2 font-bold text-sm"
                        >
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 + j * 0.1 }}
                            className="text-yellow-500"
                          >
                            ⭐
                          </motion.span>
                          {skill}
                        </motion.div>
                      ))}
                    </div>

                    {/* Badge */}
                    <motion.div
                      className={`inline-block px-4 py-2 bg-gradient-to-r ${item.color} text-white font-black text-xs rounded-lg border-2 border-black`}
                      whileHover={{ scale: 1.1, rotate: 2 }}
                    >
                      Industry Ready ✓
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom highlight */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 rounded-xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_black]"
            >
              <p className="text-center font-black text-lg">
                🎖️ Get industry-recognized certificates on completion
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* FAQ */}
        <FAQAccordion />

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-32 sm:px-6">
          {/* Animated background elements */}
          <motion.div
            className="absolute top-10 right-10 text-8xl opacity-10"
            animate={{ y: [-20, 20, -20], rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            🚀
          </motion.div>
          <motion.div
            className="absolute bottom-20 left-10 text-8xl opacity-10"
            animate={{ y: [20, -20, 20], rotate: [360, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            ⭐
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl relative z-10 text-center"
          >
            {/* Urgency badge */}
            <motion.div
              className="inline-block mb-6 border-3 border-white bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-sm uppercase"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔥 Limited Slots Available - Early Bird Pricing
            </motion.div>

            {/* Main heading */}
            <motion.h2
              className="mb-4 text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,0.5)]"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Ready to Compete?
            </motion.h2>

            {/* Subheading */}
            <motion.p
              className="mb-4 text-lg sm:text-xl font-bold text-white/95 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of students mastering AI. Start your journey today!
            </motion.p>

            {/* Features list before CTA */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-white text-sm font-bold"
            >
              {[
                "✓ Lifetime Access",
                "✓ Monthly Live Classes",
                "✓ Certification",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="border-2 border-white/50 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
                >
                  {feature}
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: "0 0 30px rgba(255, 255, 255, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative mb-6 border-4 border-white bg-gradient-to-r from-yellow-400 to-yellow-300 px-8 sm:px-12 py-4 sm:py-6 text-xl sm:text-2xl font-black uppercase text-black transition-all shadow-[6px_6px_0px_rgba(0,0,0,0.3)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🎯 Register Now - ₹199
                </span>
                <div className="absolute inset-0 -z-10 translate-x-3 translate-y-3 border-4 border-white bg-pink-400 transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
              </motion.button>
            </Link>

            {/* Pricing info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2 text-white/90"
            >
              <p className="text-sm font-bold">🏷️ Exclusive of GST | Lifetime Access</p>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-6 border-t border-white/30 text-white/80 text-sm"
            >
              <p className="font-bold">⭐ 4.9/5 from 2,000+ students | 🌍 Trusted by 200+ schools</p>
            </motion.div>
          </motion.div>
        </section>

        <Footer />
      </main>
    </>
  );
}