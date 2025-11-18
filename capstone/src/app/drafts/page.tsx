"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAllDrafts, deleteDraft, type DraftPost } from "@/lib/drafts";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);


  const loadDrafts = () => {
    const allDrafts = getAllDrafts();
    allDrafts.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setDrafts(allDrafts);
    setIsLoading(false);
  };


  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      deleteDraft(id);
      loadDrafts();
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

 
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="mb-2 bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-4xl font-extrabold text-transparent">
                  My Drafts
                </h1>
                <p className="text-slate-600">Manage your saved drafts</p>
              </div>
              <Link
                href="/editor"
                className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                New Post
              </Link>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
                <p className="text-slate-600">Loading drafts...</p>
              </div>
            )}

          
            {!isLoading && drafts.length === 0 && (
              <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                <div className="mb-4 text-6xl">📝</div>
                <h2 className="mb-2 text-2xl font-bold text-slate-800">
                  No drafts yet
                </h2>
                <p className="mb-6 text-slate-600">
                  Start writing to save your first draft!
                </p>
                <Link
                  href="/editor"
                  className="inline-block rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Create New Post
                </Link>
              </div>
            )}

            {!isLoading && drafts.length > 0 && (
              <div className="space-y-4">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-bold text-slate-800">
                          {draft.title || "Untitled Draft"}
                        </h3>
                        {draft.excerpt && (
                          <p className="mb-3 text-slate-600">{draft.excerpt}</p>
                        )}
                        {draft.content && (
                          <p className="mb-3 line-clamp-2 text-sm text-slate-500">
                            {stripHtml(draft.content).substring(0, 150)}...
                          </p>
                        )}
                        {draft.tags && draft.tags.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {draft.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-teal-100 px-2 py-1 text-xs font-semibold text-teal-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-slate-400">
                          Last updated: {formatDate(draft.updatedAt)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/editor?draft=${draft.id}`}
                          className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(draft.id)}
                          className="rounded-lg border-2 border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    </ProtectedRoute>
  );
}

