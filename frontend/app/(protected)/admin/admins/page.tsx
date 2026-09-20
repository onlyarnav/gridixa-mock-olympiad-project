"use client";

import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  updateUser, // we’ll reuse temporarily (backend upgrade later)
  promoteUserToAdmin
} from "@/services/admin";

export default function AdminAdminsPanel() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [promoting, setPromoting] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers({
        role: "admin", // 🔥 important
        limit: 100,
      });
      setAdmins(data.users || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  //////////////////////////////////////////////////////////
  // 🔥 PROMOTE USER TO ADMIN (TEMP FRONTEND LOGIC)
  //////////////////////////////////////////////////////////

  const promoteToAdmin = async () => {
    if (!email) return alert("Enter email");

    setPromoting(true);

    try {
        await promoteUserToAdmin(email);

        alert("User promoted to admin 🚀");
        setEmail("");
        await loadAdmins();

    } catch (err: any) {
        alert(err.message || "Failed to promote user");
    } finally {
        setPromoting(false);
    }
    };

  //////////////////////////////////////////////////////////

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-black">Admin Management</h2>
        <p className="text-sm font-semibold text-gray-600 mt-2">
          Manage admin access and permissions.
        </p>
      </div>

      {/* PROMOTE SECTION */}
      <div className="rounded-3xl border-4 border-black bg-[#fffbeb] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-black mb-3">Grant Admin Access</h3>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter user email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 border-2 border-black p-3 rounded-xl font-semibold"
          />

          <button
            onClick={promoteToAdmin}
            disabled={promoting}
            className="px-6 py-3 bg-black text-white font-black border-2 border-black rounded-xl hover:bg-green-400 hover:text-black transition disabled:opacity-50"
          >
            {promoting ? "Processing..." : "Make Admin"}
          </button>
        </div>
      </div>

      {/* ADMIN TABLE */}
      <div className="rounded-3xl border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="bg-black text-white p-4 flex justify-between">
          <h3 className="font-black">Admins</h3>
          <span className="text-sm">{admins.length} admins</span>
        </div>

        <table className="w-full">
          <thead className="bg-[#fffbeb] border-b-2 border-black">
            <tr>
              <th className="p-4 text-left text-xs font-black uppercase">Name</th>
              <th className="p-4 text-left text-xs font-black uppercase">Email</th>
              <th className="p-4 text-left text-xs font-black uppercase">Phone</th>
              <th className="p-4 text-left text-xs font-black uppercase">Joined</th>
            </tr>
          </thead>

          <tbody>
            {!loading && admins.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No admins found
                </td>
              </tr>
            )}

            {admins.map((admin, idx) => (
              <tr
                key={admin._id}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-4 font-bold">{admin.name}</td>
                <td className="p-4">{admin.email}</td>
                <td className="p-4">{admin.studentPhone || "-"}</td>
                <td className="p-4 text-sm">
                  {admin.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-6 text-center text-sm font-bold">
            Loading admins...
          </div>
        )}
      </div>
    </div>
  );
}