interface LikeRecord {
  postId: string; 
  userId: string; 
  likedAt: string; 
}

export function hasUserLikedPost(postId: string, userId: string): boolean {
  if (typeof window === "undefined") return false;

  const likesJson = localStorage.getItem("post_likes");
  if (!likesJson) return false;

  try {
    const likes: LikeRecord[] = JSON.parse(likesJson);
    return likes.some(
      (like) => like.postId === postId && like.userId === userId
    );
  } catch {
    return false;
  }
}

export function likePost(postId: string, userId: string): void {
  if (typeof window === "undefined") return;

  if (hasUserLikedPost(postId, userId)) {
    return; 
  }

  const likesJson = localStorage.getItem("post_likes");
  const likes: LikeRecord[] = likesJson ? JSON.parse(likesJson) : [];

  const newLike: LikeRecord = {
    postId,
    userId,
    likedAt: new Date().toISOString(),
  };

  likes.push(newLike);
  localStorage.setItem("post_likes", JSON.stringify(likes));

  const postsJson = localStorage.getItem("posts");
  if (postsJson) {
    try {
      const posts = JSON.parse(postsJson);
      const postIndex = posts.findIndex((p: any) => p.id === postId);
      if (postIndex !== -1) {
        posts[postIndex].likes = (posts[postIndex].likes || 0) + 1;
        localStorage.setItem("posts", JSON.stringify(posts));
      }
    } catch {
    
    }
  }
}

export function unlikePost(postId: string, userId: string): void {
  if (typeof window === "undefined") return;


  const likesJson = localStorage.getItem("post_likes");
  if (!likesJson) return;

  try {
    const likes: LikeRecord[] = JSON.parse(likesJson);
    const filteredLikes = likes.filter(
      (like) => !(like.postId === postId && like.userId === userId)
    );

    localStorage.setItem("post_likes", JSON.stringify(filteredLikes));

    const postsJson = localStorage.getItem("posts");
    if (postsJson) {
      const posts = JSON.parse(postsJson);
      const postIndex = posts.findIndex((p: any) => p.id === postId);
      if (postIndex !== -1 && posts[postIndex].likes > 0) {
        posts[postIndex].likes = Math.max(0, (posts[postIndex].likes || 0) - 1);
        localStorage.setItem("posts", JSON.stringify(posts));
      }
    }
  } catch {

  }
}

export function toggleLike(postId: string, userId: string): boolean {
  const isLiked = hasUserLikedPost(postId, userId);

  if (isLiked) {
    unlikePost(postId, userId);
    return false; 
  } else {
    likePost(postId, userId);
    return true; 
  }
}

export function getPostLikeCount(postId: string): number {
  if (typeof window === "undefined") return 0;

  const likesJson = localStorage.getItem("post_likes");
  if (!likesJson) return 0;

  try {
    const likes: LikeRecord[] = JSON.parse(likesJson);
    return likes.filter((like) => like.postId === postId).length;
  } catch {
    return 0;
  }
}

