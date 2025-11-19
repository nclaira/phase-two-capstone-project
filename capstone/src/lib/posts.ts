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


export async function getAllPosts(): Promise<Post[]> {
  try {
    const response = await fetch('/api/posts?status=published');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`/api/posts/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch post');
    }
    const post = await response.json();
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`/api/posts/slug/${slug}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch post');
    }
    const post = await response.json();
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  try {
    const response = await fetch(`/api/posts?authorId=${authorId}&status=published`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  try {
    const response = await fetch(`/api/posts/tag/${encodeURIComponent(tag)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function createPost(postData: Omit<Post, "id" | "slug" | "publishedAt" | "updatedAt">): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create post');
  }

  const newPost = await response.json();
  return newPost;
}

export async function updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    const error = await response.json();
    throw new Error(error.error || 'Failed to update post');
  }

  const updatedPost = await response.json();
  return updatedPost;
}

// Delete a post (soft delete - marks as draft instead of removing)
export async function deletePost(id: string): Promise<boolean> {
  try {
    const result = await updatePost(id, { status: 'draft' });
    return result !== null;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
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
export async function incrementPostViews(id: string): Promise<void> {
  try {
    const post = await getPostById(id);
    if (post) {
      await updatePost(id, { views: (post.views || 0) + 1 });
    }
  } catch (error) {
    console.error('Error incrementing post views:', error);
  }
}

// Get all tags from all posts
export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await getAllPosts();
    const tagSet = new Set<string>();
    
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag.toLowerCase()));
    });

    return Array.from(tagSet).sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}
