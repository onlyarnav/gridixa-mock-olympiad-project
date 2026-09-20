"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/services/auth";

export default function DashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const user = await getProfile();

        if (user?.paymentStatus !== "completed") {
          router.replace("/login?reason=payment_pending");
          return;
        }
      } catch {
        localStorage.clear();
        router.replace("/login?reason=unauthorized");
      }
    };

    check();
  }, [router]);

  return <>{children}</>;
}