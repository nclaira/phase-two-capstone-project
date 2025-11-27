"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Container from "@/components/Container";
import ProtectedRoute from "@/components/ProtectedRoute";
import { saveDraft, getDraftById, createNewDraft, type DraftPost } from "@/lib/drafts";
import { uploadImage, validateImageFile } from "@/lib/imageUpload";
import { useCreatePost, useUpdatePost, usePost } from "@/hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false, 
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        <p className="text-slate-600">Loading editor...</p>
      </div>
    </div>
  ),
});

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft");
  const postId = searchParams.get("post"); 
  const { user } = useAuth();

 
  const { data: editingPost } = usePost(postId || "");
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [currentDraft, setCurrentDraft] = useState<DraftPost | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (postId && editingPost && user && editingPost.authorId === user.id) {

      setTitle(editingPost.title);
      setContent(editingPost.content);
      setExcerpt(editingPost.excerpt || "");
      setTags(editingPost.tags?.join(", ") || "");
    } else if (draftId) {
    
      const draft = getDraftById(draftId);
      if (draft) {
        setCurrentDraft(draft);
        setTitle(draft.title);
        setContent(draft.content);
        setExcerpt(draft.excerpt || "");
        setTags(draft.tags?.join(", ") || "");
      }
    }
  }, [postId, editingPost, draftId, user]);

  const autoSaveDraft = useCallback(() => {
    if (!title.trim() && !content.trim()) return;

    const draftData: DraftPost = {
      id: currentDraft?.id || createNewDraft().id,
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      createdAt: currentDraft?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveDraft(draftData);
    setCurrentDraft(draftData);
  }, [title, content, excerpt, tags, currentDraft]);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSaveDraft();
    }, 2000); 

    return () => clearTimeout(timer);
  }, [autoSaveDraft]);

  const handleSaveDraft = useCallback(() => {
    if (!title.trim() && !content.trim()) {
      setMessage("Please enter a title or content to save.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setIsSaving(true);
    autoSaveDraft();
    setMessage("Draft saved successfully!");
    setTimeout(() => {
      setMessage("");
      setIsSaving(false);
    }, 2000);
  }, [title, content, autoSaveDraft]);

  const handlePublish = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      setMessage("Please enter a title and content to publish.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (!user) {
      setMessage("You must be logged in to publish");
      return;
    }

    try {
      if (editingPost) {
        updatePostMutation.mutate(
          {
            id: editingPost.id,
            updates: {
              title,
              content,
              excerpt: excerpt || content.substring(0, 150) + "...",
              tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
              status: "published",
            },
          },
          {
            onSuccess: (updatedPost) => {
              if (updatedPost) {
                setMessage("Post updated successfully!");
                setTimeout(() => {
                  router.push(`/posts/${updatedPost.slug}`);
                }, 1500);
              }
            },
            onError: () => {
              setMessage("Failed to update post. Please try again.");
            },
          }
        );
      } else {
        createPostMutation.mutate(
          {
            title,
            content,
            excerpt: excerpt || content.substring(0, 150) + "...",
            authorId: user.id,
            authorName: user.name,
            authorEmail: user.email,
            tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
            status: "published",
          },
          {
            onSuccess: (newPost) => {
              setMessage("Post published successfully!");
              setTimeout(() => {
                router.push(`/posts/${newPost.slug}`);
              }, 1500);
            },
            onError: () => {
              setMessage("Failed to publish post. Please try again.");
            },
          }
        );
      }
    } catch (error) {
      setMessage("Failed to publish post. Please try again.");
      console.error("Publish error:", error);
    }
  }, [
    title,
    content,
    excerpt,
    tags,
    user,
    editingPost,
    createPostMutation,
    updatePostMutation,
    router,
  ]);

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  }, []);

  const handleExcerptChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExcerpt(e.target.value);
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <h1 className="mb-2 bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-4xl font-extrabold text-transparent">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h1>
              <p className="text-slate-600">
                {editingPost
                  ? "Update your post and republish"
                  : "Write your story and share it with the world"}
              </p>
            </div>

            {message && (
              <div
                className={`mb-6 rounded-lg p-4 ${
                  message.includes("success")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter post title..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Excerpt (optional)
                </label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={handleExcerptChange}
                  placeholder="Brief description of your post..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={handleTagsChange}
                  placeholder="technology, programming, web"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Content *
                </label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="rounded-lg border-2 border-teal-600 bg-white px-6 py-3 font-semibold text-teal-600 transition-all duration-300 hover:bg-teal-50 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Draft"}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={createPostMutation.isPending || updatePostMutation.isPending}
                  className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
                >
                  {createPostMutation.isPending || updatePostMutation.isPending
                    ? "Publishing..."
                    : editingPost
                    ? "Update Post"
                    : "Publish Post"}
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="rounded-lg border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>

              {showPreview && (
                <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
                  <h2 className="mb-4 text-2xl font-bold text-slate-800">Preview</h2>
                  <h3 className="mb-2 text-xl font-bold text-slate-800">{title || "Untitled"}</h3>
                  {excerpt && (
                    <p className="mb-4 text-slate-600 italic">{excerpt}</p>
                  )}
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: content || "<p>No content yet...</p>" }}
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </ProtectedRoute>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
                <p className="text-slate-600">Loading editor...</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
