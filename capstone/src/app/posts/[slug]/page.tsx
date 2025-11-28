"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { getRecommendedPosts } from "@/lib/search";
import { type Post } from "@/lib/posts";
import { useAuth } from "@/contexts/AuthContext";
import { usePostBySlug, useDeletePost, useUpdatePost, useIncrementPostViews } from "@/hooks/usePosts";
import { useToggleLike, useHasUserLikedPost } from "@/hooks/useLikes";
import { useToggleFollow, useIsFollowing } from "@/hooks/useFollows";
import CommentsSection from "@/components/CommentsSection";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const slug = params.slug as string;

  const { data: post, isLoading, isError, error } = usePostBySlug(slug);
  const deletePostMutation = useDeletePost();
  const updatePostMutation = useUpdatePost();
  const incrementViewsMutation = useIncrementPostViews();
  const toggleLikeMutation = useToggleLike();
  const toggleFollowMutation = useToggleFollow();

  const { data: isLiked = false } = useHasUserLikedPost(
    post?.id || null,
    user?.id || null
  );

  const { data: isFollowingAuthor = false } = useIsFollowing(
    user?.id || null,
    post?.authorId || null
  );

  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const viewsIncrementedRef = useRef<string | null>(null);

  useEffect(() => {
    if (post?.id) {
      getRecommendedPosts(post.id, 3)
        .then(setRecommendedPosts)
        .catch((error) => {
          console.error('Error loading recommended posts:', error);
          setRecommendedPosts([]);
        });
    } else {
      setRecommendedPosts([]);
    }
  }, [post?.id]);

  useEffect(() => {
    if (post?.id && viewsIncrementedRef.current !== post.id) {
      viewsIncrementedRef.current = post.id;
      incrementViewsMutation.mutate(post.id);
    }
  }, [post?.id]);

  const handleDelete = async () => {
    if (!post) return;

    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    deletePostMutation.mutate(post.id, {
      onSuccess: () => {
        router.push("/posts");
      },
      onError: (error) => {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post. Please try again.");
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isAuthor = post && user && post.authorId?.toString() === user.id?.toString();
  const canFollow = post && user && post.authorId?.toString() !== user.id?.toString() && isAuthenticated;
  const canLike = post && user && post.authorId?.toString() !== user.id?.toString() && isAuthenticated;

  const handleLike = () => {
    if (!user || !post || !canLike) return;

    toggleLikeMutation.mutate(
      { postId: post.id, userId: user.id },
      {
        onSuccess: (data) => {
          // Like toggled successfully
        },
        onError: (error) => {
          console.error('Failed to toggle like:', error);
        },
      }
    );
  };

  const handleFollow = () => {
    if (!user || !post) return;

    toggleFollowMutation.mutate({
      followerId: user.id,
      followingId: post.authorId,
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
        <Container>
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
            <p className="text-slate-600">Loading post...</p>
          </div>
        </Container>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
        <Container>
          <div className="rounded-2xl bg-red-50 border border-red-200 p-12 text-center shadow-lg">
            <div className="mb-4 text-6xl">❌</div>
            <h2 className="mb-2 text-2xl font-bold text-red-800">
              Error Loading Post
            </h2>
            <p className="mb-6 text-red-600">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
            <button
              onClick={() => router.push("/posts")}
              className="inline-block rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Go Back to Posts
            </button>
          </div>
        </Container>
      </div>
    );
  }

  // Show not found state
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
        <Container>
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
            <div className="mb-4 text-6xl">🔍</div>
            <h2 className="mb-2 text-2xl font-bold text-slate-800">
              Post Not Found
            </h2>
            <p className="mb-6 text-slate-600">
              The post you're looking for doesn't exist.
            </p>
            <Link
              href="/posts"
              className="inline-block rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Browse All Posts
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          <article className="rounded-2xl bg-white p-8 shadow-lg">
            <Link
              href="/posts"
              className="mb-6 inline-flex items-center text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              ← Back to Posts
            </Link>

            {post.tags && post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tags/${tag.toLowerCase()}`}
                    className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-700 hover:bg-teal-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="mb-4 bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
              {post.title || 'Untitled Post'}
            </h1>

            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 text-lg font-bold text-white">
                  {post.authorName ? post.authorName.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {post.authorName || 'Anonymous'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {post.publishedAt ? formatDate(post.publishedAt) : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  {post.views !== undefined && (
                    <span>👁️ {post.views} views</span>
                  )}
                </div>

                {canLike ? (
                  <button
                    onClick={handleLike}
                    disabled={toggleLikeMutation.isPending}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      isLiked
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700 hover:bg-red-100 hover:text-red-700"
                    } disabled:opacity-50`}
                  >
                    <span>{isLiked ? "❤️" : "🤍"}</span>
                    <span>{post?.likes || 0}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700">
                    <span>❤️</span>
                    <span>{post?.likes || 0}</span>
                  </div>
                )}

                {canFollow && (
                  <button
                    onClick={handleFollow}
                    disabled={toggleFollowMutation.isPending}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      isFollowingAuthor
                        ? "border-2 border-teal-600 bg-white text-teal-600 hover:bg-teal-50"
                        : "bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md hover:scale-105 hover:shadow-lg"
                    } disabled:opacity-50`}
                  >
                    {toggleFollowMutation.isPending
                      ? "..."
                      : isFollowingAuthor
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
            </div>

            {post.featuredImage && (
              <div className="relative mb-8 h-96 w-full overflow-hidden rounded-xl">
                <Image
                  src={post.featuredImage}
                  alt={post.title || 'Post image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                  priority
                />
              </div>
            )}

            {post.excerpt && (
              <p className="mb-8 text-xl italic text-slate-600">{post.excerpt}</p>
            )}

            <div
              className="prose prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-a:text-teal-600 prose-strong:text-slate-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {isAuthor && isAuthenticated && (
              <div className="mt-8 flex gap-4 border-t border-slate-200 pt-6">
                <Link
                  href={`/editor?post=${post.id}`}
                  className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Edit Post
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deletePostMutation.isPending}
                  className="rounded-lg border-2 border-red-300 bg-white px-6 py-3 font-semibold text-red-600 transition-all duration-300 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletePostMutation.isPending ? "Deleting..." : "Delete Post"}
                </button>
              </div>
            )}
          </article>

          <CommentsSection postId={post.id} />

          {recommendedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-slate-800">
                Recommended Posts
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {recommendedPosts.map((recommendedPost) => (
                  <Link
                    key={recommendedPost.id}
                    href={`/posts/${recommendedPost.slug}`}
                    className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    {recommendedPost.featuredImage ? (
                      <div className="relative mb-4 h-32 w-full overflow-hidden rounded-xl">
                        <Image
                          src={recommendedPost.featuredImage}
                          alt={recommendedPost.title || 'Post image'}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 flex h-32 w-full items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100">
                        <span className="text-2xl">📄</span>
                      </div>
                    )}

                    <h3 className="mb-2 text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                      {recommendedPost.title || 'Untitled Post'}
                    </h3>

                    <p className="mb-3 line-clamp-2 text-sm text-slate-600">
                      {recommendedPost.excerpt || recommendedPost.content?.substring(0, 100) + "..."}
                    </p>

                    <p className="text-xs text-slate-500">
                      {recommendedPost.authorName || 'Anonymous'}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}







