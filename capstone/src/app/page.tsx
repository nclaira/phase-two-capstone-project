"use client";

import { useMemo } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { usePosts } from "@/hooks/usePosts";
import { getPopularPosts } from "@/lib/search";
import PostCard from "@/components/memoized/PostCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Home() {
  
  const { data: allPosts = [], isLoading } = usePosts();


  const latestPosts = useMemo(() => {
    return allPosts.slice(0, 6); // 6 posts
  }, [allPosts]);

  const popularPosts = useMemo(() => {
    return getPopularPosts(6); 
  }, [allPosts]); 

  return (
    <div className="min-h-screen">
      <Container className="py-16 md:py-24">
       
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-block rounded-full bg-gradient-to-r from-teal-100 via-cyan-100 to-teal-100 px-6 py-2">
            <span className="text-sm font-semibold text-teal-700">
              New Platform for Writers
            </span>
          </div>
          <h1 className="mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-5xl font-extrabold text-transparent md:text-7xl lg:text-8xl">
            Share Your Stories
          </h1>
          <p className="mb-12 text-xl text-slate-600 md:text-2xl lg:text-3xl font-medium">
            Create, publish, and connect with readers around the world
          </p>
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-teal-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/40"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-700 to-cyan-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border-2 border-teal-600 bg-white px-8 py-4 text-lg font-semibold text-teal-600 transition-all duration-300 hover:bg-teal-50 hover:scale-105 hover:shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>

        
        <div className="mx-auto mt-24 max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-800 md:text-5xl">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to create amazing content
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-8 shadow-lg shadow-teal-100/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-200/50">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-2xl text-white shadow-lg">
                ✍️
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-800">
                Rich Text Editor
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Create beautiful content with our powerful rich text editor
                supporting formatting, images, code blocks, and more.
              </p>
            </div>

           
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-rose-50 p-8 shadow-lg shadow-orange-100/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-200/50">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-400 text-2xl text-white shadow-lg">
                💬
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-800">
                Social Features
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Engage with readers through comments, likes, claps, and following
                your favorite authors for a vibrant community.
              </p>
            </div>

            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg shadow-purple-100/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-200/50">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 text-2xl text-white shadow-lg">
                📱
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-800">
                Responsive Design
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Your content looks stunning on all devices - desktop, tablet, and
                mobile with perfect responsive layouts.
              </p>
            </div>
          </div>
        </div>

       
        {latestPosts.length > 0 && (
          <div className="mx-auto mt-24 max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-slate-800 md:text-5xl">
                Latest Stories
              </h2>
              <p className="text-lg text-slate-600">
                Discover the most recent posts from our community
              </p>
            </div>

            {isLoading ? (
              <LoadingSkeleton variant="post" count={6} />
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

           
            {latestPosts.length > 0 && (
              <div className="mt-12 text-center">
                <Link
                  href="/posts"
                  className="inline-block rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  View All Posts
                </Link>
              </div>
            )}
          </div>
        )}

      
        {popularPosts.length > 0 && (
          <div className="mx-auto mt-24 max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-slate-800 md:text-5xl">
                Popular Posts
              </h2>
              <p className="text-lg text-slate-600">
                Most viewed stories from our community
              </p>
            </div>

            {isLoading ? (
              <LoadingSkeleton variant="post" count={6} />
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {popularPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}

        
        <div className="mx-auto mt-24 max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 p-12 text-center shadow-2xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div>
                <div className="mb-2 text-4xl font-bold text-white md:text-5xl">
                  10K+
                </div>
                <div className="text-teal-100">Active Writers</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-white md:text-5xl">
                  50K+
                </div>
                <div className="text-teal-100">Published Stories</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-white md:text-5xl">
                  1M+
                </div>
                <div className="text-teal-100">Happy Readers</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

