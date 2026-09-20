// services/module.ts

import { apiRequest } from "@/lib/api";

// 📦 GET MODULES
export async function getModules() {
  return apiRequest("/module/all", {
    method: "GET",
  });
}

// 📦 GET MODULE TESTS ONLY
export async function getModuleTests() {
  const data = await apiRequest("/module/all", {
    method: "GET",
  });

  // 🔥 filter here (cleaner)
  return data.filter(
    (m: any) => m.moduleTestUrl && m.moduleTestUrl !== ""
  );
}

// 📄 GET NOTE / PRACTICE FILE

export async function getProtectedFile(
  filePath: string
) {

  const token =
    localStorage.getItem("token");

  return fetch(

   `${process.env.NEXT_PUBLIC_API_URL}/module/notes?path=${encodeURIComponent(
      filePath
   )}`,

   {
     headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json, text/markdown",
    },
   }

  );

}