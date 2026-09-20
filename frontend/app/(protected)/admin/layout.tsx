"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  BookOpen,
  Shield,
  Ticket,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = [
    {
      path: "/admin/users",
      label: "Users",
      icon: <Users size={18} />,
      color: "bg-green-400",
    },
    {
      path: "/admin/modules",
      label: "Modules",
      icon: <BookOpen size={18} />,
      color: "bg-pink-400",
    },
    {
      path: "/admin/admins",
      label: "Admins",
      icon: <Shield size={18} />,
      color: "bg-blue-400",
    },
    {
      path: "/admin/coupons",
      label: "Coupons",
      icon: <Ticket size={18} />,
      color: "bg-yellow-400",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#fffbeb] font-mono text-black overflow-hidden">
      {/* MOBILE HEADER */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-white p-3"
      >
        <Menu size={22} />
      </button>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky md:top-0 md:shrink-0 md:h-screen md:overflow-y-auto z-50 w-72 bg-white border-r-[6px] border-black p-6 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="mb-10">
          <h1 className="text-3xl font-black uppercase italic bg-blue-600 text-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_black]">
            Admin Panel
          </h1>
        </div>

        <nav className="flex flex-col gap-5">
          {nav.map((item) => {
            const active = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setSidebarOpen(false);
                }}
                className={`
                  flex items-center gap-3 border-[4px] border-black p-4 font-black uppercase text-sm transition-all
                  ${
                    active
                      ? `${item.color} translate-x-1 translate-y-1 shadow-none`
                      : "bg-white shadow-[4px_4px_0px_black] hover:bg-yellow-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}          

          <button
            onClick={() => {
              logout();
              window.location.href = "/login?reason=unauthorized";
            }}
            className="mt-auto flex items-center justify-center gap-3 border-[4px] border-black p-4 font-black uppercase text-xs bg-black text-white hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>

        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 border-4 border-black bg-white p-2"
        >
          <X size={18} />
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 p-6 md:p-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}