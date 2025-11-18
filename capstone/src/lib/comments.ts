export interface Comment {
  id: string; 
  postId: string;
  authorId: string;
  authorName: string; 
  authorEmail: string; 
  content: string;
  parentId?: string; 
  createdAt: string; 
  updatedAt: string;
  likes?: number; 


export function getCommentsByPostId(postId: string): Comment[] {
  if (typeof window === "undefined") return [];

  const commentsJson = localStorage.getItem("comments");
  if (!commentsJson) return [];

  try {
    const allComments = JSON.parse(commentsJson);
    
    return allComments
      .filter((comment: Comment) => comment.postId === postId)
      .sort(
        (a: Comment, b: Comment) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  } catch {
    return [];
  }
}

export function getCommentById(id: string): Comment | null {
  if (typeof window === "undefined") return null;

  const commentsJson = localStorage.getItem("comments");
  if (!commentsJson) return null;

  try {
    const allComments = JSON.parse(commentsJson);
    return allComments.find((comment: Comment) => comment.id === id) || null;
  } catch {
    return null;
  }
}

export function getCommentReplies(parentId: string): Comment[] {
  if (typeof window === "undefined") return [];

  const commentsJson = localStorage.getItem("comments");
  if (!commentsJson) return [];

  try {
    const allComments = JSON.parse(commentsJson);
    // Filter comments that have this parentId
    return allComments
      .filter((comment: Comment) => comment.parentId === parentId)
      .sort(
        (a: Comment, b: Comment) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  } catch {
    return [];
  }
}

export function createComment(
  commentData: Omit<Comment, "id" | "createdAt" | "updatedAt">
): Comment {
  if (typeof window === "undefined") {
    throw new Error("Cannot create comment on server side");
  }

  const commentsJson = localStorage.getItem("comments");
  const allComments: Comment[] = commentsJson ? JSON.parse(commentsJson) : [];

  const newComment: Comment = {
    ...commentData,
    id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
  };

  allComments.push(newComment);

  localStorage.setItem("comments", JSON.stringify(allComments));

  return newComment;
}

export function updateComment(id: string, updates: Partial<Comment>): Comment | null {
  if (typeof window === "undefined") {
    throw new Error("Cannot update comment on server side");
  }

  const commentsJson = localStorage.getItem("comments");
  if (!commentsJson) return null;

  const allComments: Comment[] = JSON.parse(commentsJson);
  const commentIndex = allComments.findIndex((comment) => comment.id === id);

  if (commentIndex === -1) {
    return null; 
  }

  const updatedComment: Comment = {
    ...allComments[commentIndex],
    ...updates,
    id, 
    updatedAt: new Date().toISOString(),
  };

  allComments[commentIndex] = updatedComment;
  localStorage.setItem("comments", JSON.stringify(allComments));

  return updatedComment;
}

export function deleteComment(id: string): boolean {
  if (typeof window === "undefined") {
    throw new Error("Cannot delete comment on server side");
  }

  const commentsJson = localStorage.getItem("comments");
  if (!commentsJson) return false;

  const allComments: Comment[] = JSON.parse(commentsJson);
  const filteredComments = allComments.filter((comment) => comment.id !== id);

  if (filteredComments.length === allComments.length) {
    return false;
  }


  const replies = getCommentReplies(id);
  replies.forEach((reply) => deleteComment(reply.id));

  localStorage.setItem("comments", JSON.stringify(filteredComments));
  return true;
}

export function likeComment(id: string): void {
  const comment = getCommentById(id);
  if (comment) {
    updateComment(id, { likes: (comment.likes || 0) + 1 });
  }
}

export function organizeCommentsIntoTree(comments: Comment[]): Comment[] {
  const topLevelComments = comments.filter((comment) => !comment.parentId);
  const replies = comments.filter((comment) => comment.parentId);

  return topLevelComments;
}

