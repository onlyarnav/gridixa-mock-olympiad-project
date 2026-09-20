import { fetchWithAuth } from "@/lib/fetchWithAuth";

export type CouponType = "percentage" | "amount";

export interface Coupon {
  _id: string;
  code: string;
  title?: string;
  description?: string;
  type: CouponType;
  value: number;

  usageLimit?: number;
  usedCount?: number;

  active?: boolean;
  startsAt?: string;
  endsAt?: string;

  createdAt?: string;
  createdBy?: string;
}

export interface CouponPayload {
  code: string;
  title: string;
  description?: string;
  type: CouponType;
  value: number;

  usageLimit?: number;

  startsAt?: string;
  endsAt?: string;
}

export interface FetchCouponsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "expired" | "scheduled";
  type?: CouponType;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function baseUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return `${API_URL}/admin/coupons`;
}

async function requestJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetchWithAuth(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    throw new Error(
      (data as any)?.message ||
        (data as any)?.error ||
        text ||
        `Request failed with status ${res.status}`
    );
  }

  return data as T;
}

async function requestVoid(url: string, init?: RequestInit): Promise<void> {
  const res = await fetchWithAuth(url, init);
  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    throw new Error(
      (data as any)?.message ||
        (data as any)?.error ||
        text ||
        `Request failed with status ${res.status}`
    );
  }
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function fetchCoupons(params: FetchCouponsParams = {}) {
  const url = new URL(baseUrl());

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return requestJSON<{
    coupons?: Coupon[];
    items?: Coupon[];
    results?: Coupon[];
    data?: Coupon[];
    total?: number;
    page?: number;
    totalPages?: number;
  }>(url.toString(), {
    method: "GET",
  });
}

export async function fetchCouponById(id: string) {
  return requestJSON<{ coupon?: Coupon; data?: Coupon }>(`${baseUrl()}/${id}`, {
    method: "GET",
  });
}

export async function createCoupon(payload: CouponPayload) {
  return requestJSON<{ coupon?: Coupon; data?: Coupon }>(baseUrl(), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCoupon(id: string, payload: Partial<CouponPayload>) {
  return requestJSON<{ coupon?: Coupon; data?: Coupon }>(`${baseUrl()}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteCoupon(id: string) {
  return requestVoid(`${baseUrl()}/${id}`, {
    method: "DELETE",
  });
}

export async function toggleCouponStatus(id: string, active: boolean) {
  return requestJSON<{ coupon?: Coupon; data?: Coupon }>(`${baseUrl()}/${id}/toggle`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
}