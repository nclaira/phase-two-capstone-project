"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { type Comment } from "@/lib/comments";
import { useCommentReplies, useCreateComment, useDeleteComment, useLikeComment } from "@/hooks/useComments";

interface CommentProps {
  comment: Comment;
  postId: string;
}

export default function CommentComponent({
  comment,
  postId,
}: CommentProps) {
  const { user, isAuthenticated } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const { data: replies = [] } = useCommentReplies(comment.id);
  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();
  const likeCommentMutation = useLikeComment();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return "just now";
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const isAuthor = user && comment.authorId === user.id;

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;

    createCommentMutation.mutate(
      {
        postId,
        authorId: user.id,
        authorName: user.name,
        authorEmail: user.email,
        content: replyContent.trim(),
        parentId: comment.id, // This makes it a reply
      },
      {
        onSuccess: () => {
          setReplyContent("");
          setShowReplyForm(false);
        },
        onError: (error) => {
          console.error("Failed to add reply:", error);
          alert("Failed to add reply. Please try again.");
        },
      }
    );
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    deleteCommentMutation.mutate(comment.id, {
      onError: (error) => {
        console.error("Failed to delete comment:", error);
        alert("Failed to delete comment. Please try again.");
      },
    });
  };

  const handleLike = () => {
    likeCommentMutation.mutate(comment.id);
  };

  return (
    <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 text-sm font-bold text-white">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{comment.authorName}</p>
            <p className="text-xs text-slate-500">{formatDate(comment.createdAt)}</p>
          </div>
        </div>

      
        {isAuthor && isAuthenticated && (
          <button
            onClick={handleDelete}
            disabled={deleteCommentMutation.isPending}
            className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      <p className="mb-3 text-slate-700 whitespace-pre-wrap">{comment.content}</p>

      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={handleLike}
          disabled={likeCommentMutation.isPending}
          className="flex items-center gap-1 text-slate-600 hover:text-teal-600 transition-colors disabled:opacity-50"
        >
          <span>❤️</span>
          <span>{comment.likes || 0}</span>
        </button>

        {isAuthenticated && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-slate-600 hover:text-teal-600 transition-colors"
          >
            Reply
          </button>
        )}
      </div>

      {showReplyForm && isAuthenticated && (
        <form onSubmit={handleReply} className="mt-4 border-t border-slate-200 pt-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="mb-3 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            rows={3}
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createCommentMutation.isPending || !replyContent.trim()}
              className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {createCommentMutation.isPending ? "Posting..." : "Post Reply"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReplyForm(false);
                setReplyContent("");
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {replies.length > 0 && (
        <div className="mt-4 border-t border-slate-200 pt-4 pl-4">
          <p className="mb-3 text-sm font-semibold text-slate-600">
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </p>
          {replies.map((reply) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

