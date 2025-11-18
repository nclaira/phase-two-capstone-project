"use client";

interface LoadingSkeletonProps {
  variant?: "post" | "comment" | "card" | "list" | "text";
  count?: number;
}

export default function LoadingSkeleton({
  variant = "card",
  count = 1,
}: LoadingSkeletonProps) {

  const PostSkeleton = () => (
    <div className="rounded-2xl bg-white shadow-lg overflow-hidden animate-pulse">
     
      <div className="h-48 w-full bg-gradient-to-br from-slate-200 to-slate-300"></div>
      <div className="p-6">
       
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-16 rounded-full bg-slate-200"></div>
          <div className="h-6 w-20 rounded-full bg-slate-200"></div>
        </div>

        <div className="h-6 w-3/4 bg-slate-200 rounded mb-2"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
        </div>
       
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
          <div className="h-4 w-20 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  );

 
  const CommentSkeleton = () => (
    <div className="rounded-lg border border-slate-200 bg-white p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
       
        <div className="h-8 w-8 rounded-full bg-slate-200"></div>
        <div className="flex-1">
          <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
          <div className="h-3 w-16 bg-slate-200 rounded"></div>
        </div>
      </div>
     
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-200 rounded"></div>
        <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
      </div>
    </div>
  );

 
  const CardSkeleton = () => (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="h-6 w-3/4 bg-slate-200 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-200 rounded"></div>
        <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
      </div>
    </div>
  );


  const ListSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-slate-200"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
            <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

 
  const TextSkeleton = () => (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  // Render skeleton based on variant
  switch (variant) {
    case "post":
      return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      );
    case "comment":
      return (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
        </div>
      );
    case "card":
      return (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      );
    case "list":
      return <ListSkeleton />;
    case "text":
      return <TextSkeleton />;
    default:
      return <CardSkeleton />;
  }
}

