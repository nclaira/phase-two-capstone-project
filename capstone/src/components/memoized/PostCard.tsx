"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Post } from "@/lib/posts";

interface PostCardProps {
  post: Post;
}

const PostCard = memo(function PostCard({ post }: PostCardProps) {

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
    <Link
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
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-teal-100 to-cyan-100">
          <span className="text-4xl">📄</span>
        </div>
      )}

  
      <div className="p-6">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, index) => (
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
  );
});


PostCard.displayName = "PostCard";

export default PostCard;

