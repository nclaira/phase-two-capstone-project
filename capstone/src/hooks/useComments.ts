"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommentsByPostId,
  getCommentReplies,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  type Comment,
} from "@/lib/comments";


export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  byPost: (postId: string) => [...commentKeys.lists(), postId] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  replies: (parentId: string) => [...commentKeys.all, "replies", parentId] as const,
};

export function useComments(postId: string) {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => {
      return getCommentsByPostId(postId);
    },
    enabled: !!postId, 
  });
}

export function useCommentReplies(parentId: string) {
  return useQuery({
    queryKey: commentKeys.replies(parentId),
    queryFn: () => {
      return getCommentReplies(parentId);
    },
    enabled: !!parentId, 
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentData: Omit<Comment, "id" | "createdAt" | "updatedAt">) => {
      return createComment(commentData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byPost(data.postId),
      });
      
      if (data.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(data.parentId),
        });
      }
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Comment> }) => {
      return updateComment(id, updates);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.byPost(data.postId),
        });
        
        queryClient.setQueryData(commentKeys.detail(data.id), data);
      }
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return deleteComment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      likeComment(id);
      
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
}

