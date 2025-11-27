"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPosts,
  getPostById,
  getPostBySlug,
  getPostsByAuthor,
  getPostsByTag,
  createPost,
  updatePost,
  deletePost,
  incrementPostViews,
  type Post,
} from "@/lib/posts";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters?: string) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  bySlug: (slug: string) => [...postKeys.details(), "slug", slug] as const,
  byAuthor: (authorId: string) =>
    [...postKeys.all, "author", authorId] as const,
  byTag: (tag: string) => [...postKeys.all, "tag", tag] as const,
};


export function usePosts() {
  return useQuery({
    queryKey: postKeys.lists(),
    queryFn: () => {
      return getAllPosts();
    },
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => {
      return getPostById(id);
    },
    enabled: !!id,
  });
}

export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: postKeys.bySlug(slug),
    queryFn: () => {
      return getPostBySlug(slug);
    },
    enabled: !!slug, 
  });
}


export function usePostsByAuthor(authorId: string) {
  return useQuery({
    queryKey: postKeys.byAuthor(authorId),
    queryFn: () => {
      return getPostsByAuthor(authorId);
    },
    enabled: !!authorId, 
  });
}


export function usePostsByTag(tag: string) {
  return useQuery({
    queryKey: postKeys.byTag(tag),
    queryFn: () => {
      return getPostsByTag(tag);
    },
    enabled: !!tag, 
  });
}


export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: Omit<Post, "id" | "slug" | "publishedAt" | "updatedAt">) => {
      return createPost(postData);
    },
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Post> }) => {
      return updatePost(id, updates);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: postKeys.bySlug(data.slug) });
      }
    },
  });
}


export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return deletePost(id);
    },
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}


export function useIncrementPostViews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/posts/${id}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to increment views');
      }

      return response.json();
    },
    onSuccess: (updatedPost, id) => {
      // Update cache with new post data
      queryClient.setQueryData(postKeys.detail(id), updatedPost);
      if (updatedPost.slug) {
        queryClient.setQueryData(postKeys.bySlug(updatedPost.slug), updatedPost);
      }
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

