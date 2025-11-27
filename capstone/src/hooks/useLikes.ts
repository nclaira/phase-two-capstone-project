// // "use client";

// // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // import { hasUserLikedPost, toggleLike, likePost, unlikePost } from "@/lib/likes";
// // import { updatePost } from "@/lib/posts";
// // import { postKeys } from "./usePosts";

// // export function useToggleLike() {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: ({ postId, userId }: { postId: string; userId: string }) => {
// //       const isLiked = toggleLike(postId, userId);
      
// //       return { postId, userId, isLiked };
// //     },
// //     onSuccess: (data) => {
// //       queryClient.invalidateQueries({ queryKey: postKeys.detail(data.postId) });
// //       queryClient.invalidateQueries({ queryKey: postKeys.lists() });
// //     },
// //   });
// // }


// // export function useHasUserLikedPost(postId: string | null, userId: string | null) {
// //   if (!postId || !userId) return { data: false };
  
// //   return { data: hasUserLikedPost(postId, userId) };
// // }



// "use client";

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { hasUserLikedPost } from "@/lib/likes";
// import { updatePost } from "@/lib/posts";
// import { postKeys } from "./usePosts";

// export function useToggleLike() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
//       const response = await fetch(`/api/posts/${postId}/like`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to toggle like');
//       }
      
//       return response.json();
//     },
//     onSuccess: (data, variables) => {
//       // Invalidate and refetch
//       queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//     },
//   });
// }

// export function useHasUserLikedPost(postId: string | null, userId: string | null) {
//   if (!postId || !userId) return { data: false };
  
//   return { data: hasUserLikedPost(postId, userId) };
// }





// export function useHasUserLikedPost(postId: string | null, userId: string | null) {
//   return useQuery({
//     queryKey: ['hasLiked', postId, userId],
//     queryFn: async () => {
//       if (!postId || !userId) return false;
      
//       const response = await fetch(`/api/posts/${postId}/has-liked?userId=${userId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch like status');
//       }
//       const data = await response.json();
//       return data.hasLiked;
//     },
//     enabled: !!postId && !!userId,
//   });
// }






"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hasLiked', variables.postId, variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });
}

export function useHasUserLikedPost(postId: string | null, userId: string | null) {
  return useQuery({
    queryKey: ['hasLiked', postId, userId],
    queryFn: async () => {
      if (!postId || !userId) return false;
      
      const response = await fetch(`/api/posts/${postId}/has-liked?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch like status');
      }
      const data = await response.json();
      return data.hasLiked;
    },
    enabled: !!postId && !!userId,
  });
}