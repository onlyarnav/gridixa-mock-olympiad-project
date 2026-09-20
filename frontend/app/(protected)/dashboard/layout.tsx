"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BookCopy, BookSearch, PenTool, ClipboardList, LogOut, Menu, X, FileCode, Brain, Trophy } from "lucide-react";
import { getProfile } from "@/services/auth";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: BookCopy },
  { path: "/dashboard/modules", label: "Modules", icon: BookSearch },
  { path: "/dashboard/tests", label: "Tests", icon: PenTool },
  { path: "/dashboard/olympiad", label: "Mock Olympiad", icon: Trophy },
  { path: "/dashboard/resources", label: "Extra Resources", icon: Brain },
  { path: "/dashboard/profile", label: "Profile", icon: ClipboardList },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        await getProfile();
      } catch {
        localStorage.clear();
        router.replace("/login?reason=unauthorized");
      }
    };

    check();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#fff9e6] font-mono text-black">
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-white p-3 border-4 border-black shadow-[4px_4px_0px_black]"
      >
        <Menu size={22} />
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        <aside
          className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r-[6px] border-black p-6 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="text-2xl font-black uppercase italic bg-yellow-400 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_black]">
              Dashboard
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden border-4 border-black p-2 bg-white"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.path === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-4 border-[4px] border-black p-4 font-black uppercase text-sm transition-all shadow-[4px_4px_0px_black]
                    ${
                      active
                        ? "bg-blue-400 translate-x-1 translate-y-1 shadow-none"
                        : "bg-white hover:bg-yellow-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
            <button
              onClick={() => {
                logout();
                router.push("/login?reason=unauthorized");
              }}
              className="w-full flex items-center justify-center gap-3 border-[4px] border-black p-4 font-black uppercase text-xs bg-red-600 text-white hover:bg-red-600 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition shadow-[4px_4px_0px_black]"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 md:pl-10 pt-24 md:pt-10 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}