"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useComments, useCreateComment } from "@/hooks/useComments";
import CommentComponent from "./Comment";
import LoadingSkeleton from "./LoadingSkeleton";

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState("");

  const { data: allComments = [], isLoading, isError } = useComments(postId);
  const createCommentMutation = useCreateComment();

  const comments = allComments.filter((comment) => !comment.parentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    createCommentMutation.mutate(
      {
        postId,
        authorId: user.id,
        authorName: user.name,
        authorEmail: user.email,
        content: newComment.trim(),
      },
      {
        onSuccess: () => {
        
          setNewComment("");
        },
        onError: (error) => {
          console.error("Failed to add comment:", error);
          alert("Failed to add comment. Please try again.");
        },
      }
    );
  };

  return (
    <div className="mt-12 rounded-2xl bg-white p-8 shadow-lg">
      
      <h2 className="mb-6 text-2xl font-bold text-slate-800">
        Comments ({comments.length})
      </h2>

      {isAuthenticated && user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={createCommentMutation.isPending || !newComment.trim()}
            className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
          >
            {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="mb-8 rounded-lg bg-slate-50 p-4 text-center">
          <p className="text-slate-600">
            Please{" "}
            <a href="/login" className="font-semibold text-teal-600 hover:text-teal-700">
              log in
            </a>{" "}
            to leave a comment
          </p>
        </div>
      )}

      {isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
          <p className="text-red-600">Failed to load comments. Please try again.</p>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton variant="comment" count={3} />
      ) : !isError && comments.length === 0 ? (
        <div className="rounded-lg bg-slate-50 p-8 text-center">
          <p className="text-slate-600">No comments yet. Be the first to comment!</p>
        </div>
      ) : !isError ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentComponent
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

