"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  PencilLine,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import {
  Coupon,
  CouponPayload,
  createCoupon,
  deleteCoupon,
  fetchCoupons,
  toggleCouponStatus,
  updateCoupon,
} from "@/services/coupons";

type CouponType = "percentage" | "amount";

interface CouponFormState {
  code: string;
  title: string;
  description: string;
  type: CouponType;
  value: string;
  usageLimit: string;
  startAt: string;
  endAt: string;
}

const emptyForm: CouponFormState = {
  code: "",
  title: "",
  description: "",
  type: "percentage",
  value: "",
  usageLimit: "",
  startAt: "",
  endAt: "",
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const [search, setSearch] = useState("");

  //////////////////////////////////////////////////////////

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetchCoupons({ limit: 100 });
      setCoupons(res.coupons || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  //////////////////////////////////////////////////////////

  const handleChange = (k: keyof CouponFormState, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const payload = (): CouponPayload => ({
    code: form.code.toUpperCase().trim(),
    title: form.title.trim(),
    description: form.description.trim(),
    type: form.type,
    value: Number(form.value),
    usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
    startsAt: form.startAt ? new Date(form.startAt).toISOString() : undefined,
    endsAt: form.endAt ? new Date(form.endAt).toISOString() : undefined,
  });

  const submit = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await updateCoupon(editingId, payload());
      } else {
        await createCoupon(payload());
      }

      setForm(emptyForm);
      setEditingId(null);
      setExpanded(false);
      await loadCoupons();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  //////////////////////////////////////////////////////////

  const filtered = useMemo(() => {
    return coupons.filter((c) =>
      [c.code, c.title].join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [coupons, search]);

  //////////////////////////////////////////////////////////

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="border-4 border-black p-5 bg-white">
        <h2 className="text-3xl font-black">Coupons</h2>
        <p className="text-sm text-gray-600">
          Create and manage discount coupons.
        </p>
      </div>

      {/* CREATE BAR */}
      <div
        className="border-4 border-black bg-[#fffbeb] p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-black text-lg">
            {editingId ? "Edit Coupon" : "Create Coupon"}
          </h3>
          <Plus />
        </div>

        {!expanded && (
          <p className="text-sm text-gray-600 mt-2">
            Click to create a new coupon
          </p>
        )}
      </div>

      {/* FORM */}
      {expanded && (
        <div className="border-4 border-black p-5 bg-white space-y-4">

          <input
            placeholder="COUPON CODE"
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value)}
            className="border p-3 w-full"
          />

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="border p-3 w-full"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="border p-3 w-full"
          />

          <select
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="border p-3 w-full"
          >
            <option value="percentage">Percentage</option>
            <option value="amount">Flat Amount</option>
          </select>

          <input
            type="number"
            placeholder={form.type === "percentage" ? "Discount %" : "Amount ₹"}
            value={form.value}
            onChange={(e) => handleChange("value", e.target.value)}
            className="border p-3 w-full"
          />

          <input
            type="number"
            placeholder="Usage Limit"
            value={form.usageLimit}
            onChange={(e) => handleChange("usageLimit", e.target.value)}
            className="border p-3 w-full"
          />

          <input
            type="datetime-local"
            value={form.startAt}
            onChange={(e) => handleChange("startAt", e.target.value)}
            className="border p-3 w-full"
          />

          <input
            type="datetime-local"
            value={form.endAt}
            onChange={(e) => handleChange("endAt", e.target.value)}
            className="border p-3 w-full"
          />

          <button
            onClick={submit}
            className="bg-black text-white px-5 py-3 font-bold"
          >
            {saving ? "Saving..." : "Save Coupon"}
          </button>
        </div>
      )}

      {/* SEARCH */}
      <input
        placeholder="Search coupons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 w-full"
      />

      {/* TABLE */}
      <div className="border-4 border-black bg-white">
        <table className="w-full">
          <thead className="bg-[#fffbeb] border-b-2 border-black">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Value</th>
              <th className="p-3">Usage</th>
              <th className="p-3">Created By</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c._id} className="border-t">

                <td className="p-3 font-bold">{c.code}</td>
                <td className="p-3">{c.title}</td>

                <td className="p-3">{c.type}</td>

                <td className="p-3">
                  {c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}
                </td>

                <td className="p-3">
                  {c.usedCount || 0}/{c.usageLimit || "∞"}
                </td>

                <td className="p-3 text-sm">
                  {c.createdBy || "-"}
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => {
                      setEditingId(c._id);
                      setForm({
                        code: c.code,
                        title: c.title || "",
                        description: c.description || "",
                        type: c.type,
                        value: String(c.value),
                        usageLimit: String(c.usageLimit || ""),
                        startAt: "",
                        endAt: "",
                      });
                      setExpanded(true);
                    }}
                    className="bg-black text-white px-3 py-1"
                  >
                    <PencilLine size={14} />
                  </button>

                  <button
                    onClick={() => toggleCouponStatus(c._id, !c.active)}
                    className="bg-yellow-300 px-3 py-1"
                  >
                    {c.active ? <ToggleRight /> : <ToggleLeft />}
                  </button>

                  <button
                    onClick={() => deleteCoupon(c._id).then(loadCoupons)}
                    className="bg-red-300 px-3 py-1"
                  >
                    <Trash2 size={14} />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && <div className="p-4 text-center">Loading...</div>}
      </div>
    </div>
  );
}