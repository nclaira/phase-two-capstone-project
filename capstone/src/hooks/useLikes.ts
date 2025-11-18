"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hasUserLikedPost, toggleLike, likePost, unlikePost } from "@/lib/likes";
import { updatePost } from "@/lib/posts";
import { postKeys } from "./usePosts";

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) => {
      const isLiked = toggleLike(postId, userId);
      
      return { postId, userId, isLiked };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(data.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}


export function useHasUserLikedPost(postId: string | null, userId: string | null) {
  if (!postId || !userId) return { data: false };
  
  return { data: hasUserLikedPost(postId, userId) };
}

