export interface Post {
  id: string; 
  title: string; 
  content: string; 
  excerpt: string;
  slug: string; 
  authorId: string; 
  authorName: string; 
  authorEmail: string; 
  tags: string[]; 
  featuredImage?: string; 
  publishedAt: string; 
  updatedAt: string; 
  status: "published" | "draft"; 
  views?: number; 
  likes?: number;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase() 
    .trim() 
    .replace(/[^\w\s-]/g, "") 
    .replace(/[\s_-]+/g, "-") 
    .replace(/^-+|-+$/g, ""); 
}


export function getAllPosts(): Post[] {
  if (typeof window === "undefined") return [];

  const postsJson = localStorage.getItem("posts");
  if (!postsJson) return [];

  try {
    const posts = JSON.parse(postsJson);
    
    return posts
      .filter((post: Post) => post.status === "published")
      .sort(
        (a: Post, b: Post) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  } catch {
    return [];
  }
}

export function getPostById(id: string): Post | null {
  const posts = getAllPosts();
  return posts.find((post) => post.id === id) || null;
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export function getPostsByAuthor(authorId: string): Post[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.authorId === authorId);
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts();
  return posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function createPost(postData: Omit<Post, "id" | "slug" | "publishedAt" | "updatedAt">): Post {
  if (typeof window === "undefined") {
    throw new Error("Cannot create post on server side");
  }

  const posts = getAllPosts();
  
  const newPost: Post = {
    ...postData,
    id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    slug: generateSlug(postData.title),
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
  };

  const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
  allPosts.push(newPost);
  localStorage.setItem("posts", JSON.stringify(allPosts));

  return newPost;
}

export function updatePost(id: string, updates: Partial<Post>): Post | null {
  if (typeof window === "undefined") {
    throw new Error("Cannot update post on server side");
  }

  const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
  const postIndex = allPosts.findIndex((post: Post) => post.id === id);

  if (postIndex === -1) {
    return null; // Post not found
  }

  // Update the post
  const updatedPost: Post = {
    ...allPosts[postIndex],
    ...updates,
    id, // Keep original ID
    updatedAt: new Date().toISOString(),
    // If title changed, update slug
    slug: updates.title ? generateSlug(updates.title) : allPosts[postIndex].slug,
  };

  allPosts[postIndex] = updatedPost;
  localStorage.setItem("posts", JSON.stringify(allPosts));

  return updatedPost;
}

// Delete a post (soft delete - marks as draft instead of removing)
export function deletePost(id: string): boolean {
  if (typeof window === "undefined") {
    throw new Error("Cannot delete post on server side");
  }

  const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
  const postIndex = allPosts.findIndex((post: Post) => post.id === id);

  if (postIndex === -1) {
    return false; // Post not found
  }

  // Soft delete: change status to draft instead of removing
  allPosts[postIndex].status = "draft";
  allPosts[postIndex].updatedAt = new Date().toISOString();
  localStorage.setItem("posts", JSON.stringify(allPosts));

  return true;
}

// Hard delete (completely remove from storage)
export function hardDeletePost(id: string): boolean {
  if (typeof window === "undefined") {
    throw new Error("Cannot delete post on server side");
  }

  const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
  const filteredPosts = allPosts.filter((post: Post) => post.id !== id);
  
  if (filteredPosts.length === allPosts.length) {
    return false; // Post not found
  }

  localStorage.setItem("posts", JSON.stringify(filteredPosts));
  return true;
}

// Increment post views
export function incrementPostViews(id: string): void {
  const post = getPostById(id);
  if (post) {
    updatePost(id, { views: (post.views || 0) + 1 });
  }
}

// Get all tags from all posts
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag.toLowerCase()));
  });

  return Array.from(tagSet).sort();
}
