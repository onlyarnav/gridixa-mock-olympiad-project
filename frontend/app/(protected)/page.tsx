"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/services/auth";

export default function RootRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const user = await getProfile();

        if (user?.role === "admin") {
          router.replace("/admin/users");
        } else {
          router.replace("/dashboard");
        }
      } catch {
        localStorage.clear();
        router.replace("/login?reason=unauthorized");
      }
    };

    run();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff9e6] font-mono">
      <div className="border-4 border-black bg-white px-6 py-4 font-black shadow-[8px_8px_0px_black]">
        Redirecting...
      </div>
    </div>
  );
}