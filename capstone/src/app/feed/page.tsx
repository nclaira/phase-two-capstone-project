"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAllPosts, type Post } from "@/lib/posts";
import { getPersonalizedFeed, getFollowing } from "@/lib/follows";
import { useAuth } from "@/contexts/AuthContext";

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadFeed();
    }
  }, [user]);

  const loadFeed = () => {
    if (!user) return;

    const followingList = getFollowing(user.id);
    setFollowing(followingList);

    if (followingList.length === 0) {
      setIsLoading(false);
      return; 
    }

    const allPosts = getAllPosts();

    const feedPosts = allPosts.filter((post) =>
      followingList.includes(post.authorId)
    );

    feedPosts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    setPosts(feedPosts);
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") {
      return html.replace(/<[^>]*>/g, "").substring(0, 150);
    }
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="mb-2 bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-4xl font-extrabold text-transparent">
                Your Feed
              </h1>
              <p className="text-slate-600">
                Posts from authors you follow
              </p>
            </div>

          
            {isLoading && (
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
                <p className="text-slate-600">Loading feed...</p>
              </div>
            )}


            {!isLoading && following.length === 0 && (
              <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                <div className="mb-4 text-6xl">👥</div>
                <h2 className="mb-2 text-2xl font-bold text-slate-800">
                  Start Following Authors
                </h2>
                <p className="mb-6 text-slate-600">
                  Follow authors to see their posts in your personalized feed
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/posts"
                    className="inline-block rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Browse Posts
                  </Link>
                </div>
              </div>
            )}


            {!isLoading && following.length > 0 && posts.length === 0 && (
              <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                <div className="mb-4 text-6xl">📭</div>
                <h2 className="mb-2 text-2xl font-bold text-slate-800">
                  No New Posts
                </h2>
                <p className="mb-6 text-slate-600">
                  Authors you follow haven&apos;t posted anything recently
                </p>
                <Link
                  href="/posts"
                  className="inline-block rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Browse All Posts
                </Link>
              </div>
            )}

            {!isLoading && posts.length > 0 && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="group rounded-2xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    {post.featuredImage ? (
                      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="flex h-48 w-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-teal-100 to-cyan-100">
                        <span className="text-4xl">📄</span>
                      </div>
                    )}

                  
                    <div className="p-6">
                 
                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-teal-100 px-2 py-1 text-xs font-semibold text-teal-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      
                      <h2 className="mb-2 text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                        {post.title}
                      </h2>

                    
                      <p className="mb-4 line-clamp-3 text-sm text-slate-600">
                        {post.excerpt || stripHtml(post.content)}
                      </p>

                     
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{post.authorName}</span>
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>

                     
                      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                        {post.views !== undefined && (
                          <span>👁️ {post.views} views</span>
                        )}
                        {post.likes !== undefined && (
                          <span>❤️ {post.likes} likes</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    </ProtectedRoute>
  );
}

