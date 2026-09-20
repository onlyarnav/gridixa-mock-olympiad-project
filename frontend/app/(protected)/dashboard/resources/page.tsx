"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchResources, type ResourceItem } from "@/services/resources";
import {
  BookOpen,
  Search,
  PlayCircle,
  FileText,
  ExternalLink,
  Loader2,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Eye,
  Video,
  Layers3,
  Compass,
  BadgeCheck,
} from "lucide-react";

type FilterMode = "all" | "documents" | "videos";

function ResourceCard({
  resource,
}: {
  resource: ResourceItem;
}) {
  const hasVideo = !!resource.videoUrl;
  const hasContent = !!resource.contentUrl;

  return (
    <div className="group relative overflow-hidden rounded-[1.6rem] border-[4px] border-black bg-white shadow-[10px_10px_0px_black] transition-all duration-200 hover:-translate-y-1 hover:shadow-[14px_14px_0px_black]">
      <div className="absolute inset-x-0 top-0 h-2 bg-black" />
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#fffbeb] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">
              <Sparkles size={12} />
              Student Resource
            </div>

            <h3 className="text-xl font-black uppercase leading-tight md:text-2xl">
              {resource.title}
            </h3>

            {resource.description && (
              <p className="mt-3 text-sm font-semibold leading-7 text-black/70 md:text-base">
                {resource.description}
              </p>
            )}
          </div>

          <div className="shrink-0 rounded-2xl border-2 border-black bg-[#fffbeb] p-3 shadow-[4px_4px_0px_black]">
            <BookOpen size={20} />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-black bg-[#fffbeb] p-4">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-black/60">
              <FileText size={14} />
              Reading
            </div>
            <p className="mt-2 text-sm font-bold">{hasContent ? "Available" : "Coming soon"}</p>
          </div>

          <div className="rounded-2xl border-2 border-black bg-[#fffbeb] p-4">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-black/60">
              <Video size={14} />
              Video
            </div>
            <p className="mt-2 text-sm font-bold">{hasVideo ? "Available" : "Coming soon"}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <a
            href={resource.contentUrl || "#"}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (!resource.contentUrl) e.preventDefault();
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border-4 border-black px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_black] transition ${
              hasContent
                ? "bg-yellow-400 hover:bg-blue-500 hover:text-white"
                : "cursor-not-allowed bg-gray-200 text-gray-500"
            }`}
          >
            <FileText size={16} />
            Open Notes
            <ExternalLink size={14} />
          </a>

          <a
            href={resource.videoUrl || "#"}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (!resource.videoUrl) e.preventDefault();
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border-4 border-black px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_black] transition ${
              hasVideo
                ? "bg-pink-500 text-white hover:bg-black"
                : "cursor-not-allowed bg-gray-200 text-gray-500"
            }`}
          >
            <PlayCircle size={16} />
            Watch Video
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [error, setError] = useState("");

  const loadResources = async (showRefreshing = false) => {
    try {
      showRefreshing ? setRefreshing(true) : setLoading(true);
      setError("");

      const data = await fetchResources();
      setResources(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load resources");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const filteredResources = useMemo(() => {
    const q = search.trim().toLowerCase();

    return resources.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      const hasVideo = !!item.videoUrl;
      const hasContent = !!item.contentUrl;

      const matchesSearch = !q || title.includes(q) || desc.includes(q);

      const matchesFilter =
        filterMode === "all" ||
        (filterMode === "videos" && hasVideo) ||
        (filterMode === "documents" && hasContent);

      return matchesSearch && matchesFilter;
    });
  }, [resources, search, filterMode]);

  const stats = useMemo(() => {
    const total = resources.length;
    const videos = resources.filter((r) => !!r.videoUrl).length;
    const docs = resources.filter((r) => !!r.contentUrl).length;

    return { total, videos, docs };
  }, [resources]);

  return (
    <div className="min-h-screen bg-[#fffbeb] text-black">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-black bg-white shadow-[16px_16px_0px_black]">
          <div className="absolute inset-x-0 top-0 bg-black" />
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#fffbeb] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                <Layers3 size={12} />
                Resources Hub
              </div>

              <h1 className="mt-4 text-4xl font-black uppercase leading-tight md:text-6xl">
                Learn Beyond
                <span className="text-blue-600"> Modules</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-black/70 md:text-base">
                Explore extra notes, explainers, and videos shared by our team. Everything here is designed to help students revise faster and understand concepts better.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.2rem] border-[4px] border-black bg-[#fffbeb] px-4 py-3 shadow-[6px_6px_0px_black]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">Total Resources</p>
                  <p className="mt-1 text-2xl font-black">{stats.total}</p>
                </div>

                <div className="rounded-[1.2rem] border-[4px] border-black bg-yellow-400 px-4 py-3 shadow-[6px_6px_0px_black]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">Notes</p>
                  <p className="mt-1 text-2xl font-black">{stats.docs}</p>
                </div>

                <div className="rounded-[1.2rem] border-[4px] border-black bg-pink-500 px-4 py-3 text-white shadow-[6px_6px_0px_black]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Videos</p>
                  <p className="mt-1 text-2xl font-black">{stats.videos}</p>
                </div>
              </div>
            </div>

            <div className="border-t-4 border-black bg-[#fff9e6] p-6 md:p-8 lg:border-l-4 lg:border-t-0">
              <div className="rounded-[1.6rem] border-[4px] border-black bg-white p-5 shadow-[8px_8px_0px_black]">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/60">
                  <Compass size={14} />
                  How to use
                </div>
                <div className="mt-4 space-y-3 text-sm font-semibold leading-7">
                  <p>• Open the notes for quick reading and revision.</p>
                  <p>• Watch the linked video for deeper explanations.</p>
                  <p>• Search by title or description.</p>
                  <p>• Use filters to separate documents and videos.</p>
                </div>

                <div className="mt-5 rounded-[1.2rem] border-2 border-black bg-black p-4 text-white">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">
                    <BadgeCheck size={14} />
                    Pro tip
                  </div>
                  <p className="mt-2 text-sm font-bold leading-6">
                    Bookmark this page and revisit it whenever you need extra clarity before exams.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border-[6px] border-black bg-white p-4 shadow-[12px_12px_0px_black] md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1">
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-black/50">
                Search resources
              </label>
              <div className="flex items-center gap-3 rounded-[1.2rem] border-[4px] border-black bg-[#fffbeb] px-4 py-3">
                <Search size={18} className="shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-black/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFilterMode("all")}
                className={`rounded-[1rem] border-[4px] border-black px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_black] transition ${
                  filterMode === "all"
                    ? "bg-black text-white"
                    : "bg-white hover:bg-yellow-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode("documents")}
                className={`rounded-[1rem] border-[4px] border-black px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_black] transition ${
                  filterMode === "documents"
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-blue-100"
                }`}
              >
                Docs
              </button>
              <button
                onClick={() => setFilterMode("videos")}
                className={`rounded-[1rem] border-[4px] border-black px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_black] transition ${
                  filterMode === "videos"
                    ? "bg-pink-500 text-white"
                    : "bg-white hover:bg-pink-100"
                }`}
              >
                Videos
              </button>
            </div>

            <button
              onClick={() => loadResources(true)}
              className="inline-flex items-center justify-center gap-2 rounded-[1rem] border-[4px] border-black bg-yellow-400 px-5 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_black] transition hover:bg-blue-500 hover:text-white"
            >
              {refreshing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Refreshing
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 flex min-h-[40vh] items-center justify-center rounded-[2rem] border-[6px] border-black bg-white shadow-[12px_12px_0px_black]">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin" />
              <p className="mt-4 text-lg font-black uppercase">Loading resources...</p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-[2rem] border-[6px] border-black bg-white p-8 text-center shadow-[12px_12px_0px_black]">
            <p className="text-lg font-black uppercase text-red-600">No Resources Yet</p>
            <p className="mt-2 text-sm font-semibold text-black/70">More resources will be added soon. Please check back later.</p>
            <button
              onClick={() => loadResources(true)}
              className="mt-6 rounded-[1rem] border-[4px] border-black bg-yellow-100 px-5 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0px_black] transition hover:bg-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Try Again
            </button>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border-[6px] border-black bg-white p-10 text-center shadow-[12px_12px_0px_black]">
            <Eye size={44} className="mx-auto" />
            <h2 className="mt-4 text-2xl font-black uppercase">No resources yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-black/70">
              Once your team starts adding resource documents in MongoDB, they will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((resource, index) => (
              <div key={resource._id || `${resource.title}-${index}`}>
                <ResourceCard resource={resource} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-[2rem] border-[6px] border-black bg-black p-6 text-white shadow-[12px_12px_0px_black]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-black uppercase text-yellow-300">Need more help?</h3>
              <p className="mt-1 text-sm font-semibold text-white/80">
                Keep checking this page as we add more study notes, explainer videos, and revision material.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-[1rem] border-[4px] border-black bg-yellow-400 px-5 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0px_white] transition hover:bg-pink-500 hover:text-white"
            >
              <ChevronRight size={16} />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}