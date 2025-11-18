/"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "@/components/memoized/PostCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import SearchBar from "@/components/memoized/SearchBar";
import { searchPosts } from "@/lib/search";

export default function PostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const { data: allPosts = [], isLoading, isError, error } = usePosts();
  
  const [searchResults, setSearchResults] = useState<typeof allPosts>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState(searchQuery);

  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true);

      const timer = setTimeout(() => {
        const results = searchPosts(query);
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSearchResults(allPosts);
      setIsSearching(false);
    }
  }, [query, allPosts]);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);


  const memoizedPosts = useMemo(() => {
    return query.trim() ? searchResults : allPosts;
  }, [allPosts, searchResults, query]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-5xl font-extrabold text-transparent">
              All Posts
            </h1>
            <p className="text-xl text-slate-600">
              Discover stories, ideas, and perspectives
            </p>
          </div>

          <div className="mb-12 max-w-2xl mx-auto">
            <SearchBar 
              placeholder="Search posts by title, content, or author..."
              onSearch={(searchQuery) => {
                const url = searchQuery.trim() 
                  ? `/posts?q=${encodeURIComponent(searchQuery)}` 
                  : '/posts';
                router.push(url);
              }}
            />
          </div>

          {isError && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-8 text-center shadow-lg">
              <div className="mb-4 text-6xl">❌</div>
              <h2 className="mb-2 text-2xl font-bold text-red-800">
                Error Loading Posts
              </h2>
              <p className="mb-6 text-red-600">
                {error instanceof Error ? error.message : "Something went wrong"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Try Again
              </button>
            </div>
          )}

          {isLoading && <LoadingSkeleton variant="post" count={6} />}

          {!isLoading && !isError && (query.trim() ? searchResults.length === 0 : allPosts.length === 0) && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
              <div className="mb-4 text-6xl">📝</div>
              <h2 className="mb-2 text-2xl font-bold text-slate-800">
                No posts yet
              </h2>
              <p className="mb-6 text-slate-600">
                Be the first to publish a story!
              </p>
            </div>
          )}

          {isSearching && (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
              <p className="mt-4 text-slate-600">Searching posts...</p>
            </div>
          )}

          {!isLoading && !isError && !isSearching && memoizedPosts.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {memoizedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

