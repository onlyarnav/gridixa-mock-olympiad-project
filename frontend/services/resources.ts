import { apiRequest } from "@/lib/api";

export interface ResourceItem {
  _id?: string;
  title: string;
  description?: string;
  contentUrl?: string;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchResources(): Promise<ResourceItem[]> {
  const res = await apiRequest("/resources", {
    method: "GET",
  });

  return res.resources || res.data || res || [];
}