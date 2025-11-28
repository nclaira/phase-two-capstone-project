"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  isFollowing,
  toggleFollow,
  getFollowing,
  getFollowers,
  getFollowingCount,
  getFollowersCount,
  getPersonalizedFeed,
} from "@/lib/follows";

export const followKeys = {
  all: ["follows"] as const,
  isFollowing: (followerId: string, followingId: string) =>
    [...followKeys.all, "check", followerId, followingId] as const,
  following: (userId: string) => [...followKeys.all, "following", userId] as const,
  followers: (userId: string) => [...followKeys.all, "followers", userId] as const,
  feed: (userId: string) => [...followKeys.all, "feed", userId] as const,
};

export function useIsFollowing(followerId: string | null, followingId: string | null) {
  return useQuery({
    queryKey: followKeys.isFollowing(followerId || "", followingId || ""),
    queryFn: async () => {
      if (!followerId || !followingId) return false;
      
      const response = await fetch(`/api/users/${followerId}/is-following?followingId=${followingId}`);
      if (!response.ok) return false;
      
      const data = await response.json();
      return data.isFollowing;
    },
    enabled: !!followerId && !!followingId,
  });
}

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: followKeys.following(userId),
    queryFn: () => {
      return getFollowing(userId);
    },
    enabled: !!userId,
  });
}

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: followKeys.followers(userId),
    queryFn: () => {
      return getFollowers(userId);
    },
    enabled: !!userId,
  });
}

export function useFollowingCount(userId: string) {
  return useQuery({
    queryKey: [...followKeys.following(userId), "count"],
    queryFn: () => {
      return getFollowingCount(userId);
    },
    enabled: !!userId,
  });
}


export function useFollowersCount(userId: string) {
  return useQuery({
    queryKey: [...followKeys.followers(userId), "count"],
    queryFn: () => {
      return getFollowersCount(userId);
    },
    enabled: !!userId,
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      followerId,
      followingId,
    }: {
      followerId: string;
      followingId: string;
    }) => {
      const response = await fetch(`/api/users/${followerId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followingId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle follow');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        followKeys.isFollowing(variables.followerId, variables.followingId),
        data.isFollowing
      );
      
      queryClient.invalidateQueries({
        queryKey: followKeys.following(variables.followerId),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.followers(variables.followingId),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.feed(variables.followerId),
      });
    },
  });
}

export function usePersonalizedFeed(userId: string) {
  return useQuery({
    queryKey: followKeys.feed(userId),
    queryFn: () => {
      return getPersonalizedFeed(userId);
    },
    enabled: !!userId,
  });
}

