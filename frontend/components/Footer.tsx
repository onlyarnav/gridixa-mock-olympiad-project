import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  Youtube,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 pt-16 pb-10 border-t-[6px] border-black">

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center md:text-left">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl md:text-2xl font-black mb-3">
            AI OLYMPIAD 2026
          </h2>
          <p className="text-xs opacity-70 leading-relaxed">
            Empowering students of classes 6–12 with practical Artificial Intelligence
            learning, competitions, and real-world exposure.
          </p>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-black text-lg mb-3 uppercase">Contact</h3>

          <p className="text-sm opacity-80">Email</p>
          <a
            href="mailto:support@gridixa.in"
            className="underline hover:text-yellow-400 block mb-3 transition"
          >
            support@gridixa.in
          </a>

          <p className="text-sm opacity-80">Phone</p>
          <a
            href="tel:+919625543638"
            className="underline hover:text-yellow-400 transition"
          >
            +91 96255 43638
          </a>
        </div>

        {/* LEGAL */}
        <div>
          <h3 className="font-black text-lg mb-3 uppercase">Legal</h3>

          <div className="flex flex-col gap-2 text-sm">

            <Link
              href="/privacy-policy"
              className="hover:text-yellow-400 underline transition"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="hover:text-yellow-400 underline transition"
            >
              Terms & Conditions
            </Link>

          </div>
        </div>

        {/* SOCIALS */}
        <div>
          <h3 className="font-black text-lg mb-3 uppercase">Connect</h3>

          <div className="flex justify-center md:justify-start gap-4 flex-wrap">

            <a
              href="https://instagram.com/gridixa"
              target="_blank"
              className="hover:text-pink-400 transition"
            >
              <Instagram />
            </a>

            <a
              href="https://linkedin.com/company/gridixa"
              target="_blank"
              className="hover:text-blue-400 transition"
            >
              <Linkedin />
            </a>

            <a
              href="https://twitter.com/gridixa"
              target="_blank"
              className="hover:text-blue-400 transition"
            >
              <Twitter />
            </a>

            <a
              href="https://facebook.com/gridixa"
              target="_blank"
              className="hover:text-blue-400 transition"
            >
              <Facebook />
            </a>

            <a
              href="https://youtube.com/@gridixa"
              target="_blank"
              className="hover:text-red-400 transition"
            >
              <Youtube />
            </a>

            <a
              href="mailto:support@gridixa.in"
              className="hover:text-yellow-400 transition"
            >
              <Mail />
            </a>

          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto mt-10 border-t border-white/20 pt-6 text-center">

        {/* LEGAL MINI ROW */}
        <div className="flex justify-center gap-6 text-xs mb-3">

          <Link
            href="/privacy-policy"
            className="hover:text-yellow-400 transition"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="hover:text-yellow-400 transition"
          >
            Terms
          </Link>

        </div>

        {/* COPYRIGHT */}
        <p className="text-xs opacity-60">
          © 2026 Gridixa. All rights reserved.
        </p>

      </div>
    </footer>
  );
}