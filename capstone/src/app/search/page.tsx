"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import SearchBar from "@/components/SearchBar";
import { searchPosts } from "@/lib/search";
import { type Post } from "@/lib/posts";

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true);
    
      const searchTimeout = setTimeout(async () => {
        try {
          const searchResults = await searchPosts(query);
          setResults(searchResults);
        } catch (error) {
          console.error('Error searching posts:', error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query]);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

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
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
              Search Posts
            </h1>
            <p className="text-slate-600">Find stories, ideas, and perspectives</p>
          </div>

          <div className="mb-12">
            <SearchBar
              placeholder="Search by title, content, tags, or author..."
              onSearch={(searchQuery) => {

              }}
            />
          </div>

          {query.trim() && (
            <div>
              <div className="mb-6">
                {isSearching ? (
                  <p className="text-slate-600">Searching...</p>
                ) : (
                  <p className="text-slate-600">
                    {results.length === 0
                      ? "No results found"
                      : `Found ${results.length} ${results.length === 1 ? "result" : "results"}`}
                  </p>
                )}
              </div>

              {isSearching && (
                <div className="text-center">
                  <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
                  <p className="text-slate-600">Searching posts...</p>
                </div>
              )}

              {!isSearching && results.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((post) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.slug}`}
                      className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      {post.featuredImage ? (
                        <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="mb-4 flex h-40 w-full items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100">
                          <span className="text-3xl">📄</span>
                        </div>
                      )}

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

                      <h3 className="mb-2 text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                        {post.excerpt || stripHtml(post.content)}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{post.authorName}</span>
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!isSearching && query.trim() && results.length === 0 && (
                <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                  <div className="mb-4 text-6xl">🔍</div>
                  <h2 className="mb-2 text-2xl font-bold text-slate-800">
                    No results found
                  </h2>
                  <p className="mb-6 text-slate-600">
                    Try different keywords or browse all posts
                  </p>
                  <Link
                    href="/posts"
                    className="inline-block rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Browse All Posts
                  </Link>
                </div>
              )}
            </div>
          )}

          {!query.trim() && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
              <div className="mb-4 text-6xl">🔍</div>
              <h2 className="mb-2 text-2xl font-bold text-slate-800">
                Start Searching
              </h2>
              <p className="text-slate-600">
                Enter keywords to search through all posts
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
                <p className="text-slate-600">Loading search...</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

