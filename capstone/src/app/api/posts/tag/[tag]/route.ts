import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

// GET - Get posts by tag
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    await connectDB();

    const { tag } = await params;

    const posts = await Post.find({
      tags: { $in: [new RegExp(tag, 'i')] },
      status: 'published',
    })
      .sort({ publishedAt: -1 })
      .lean();

    const formattedPosts = posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      authorId: post.authorId.toString(),
      authorName: post.authorName,
      authorEmail: post.authorEmail,
      tags: post.tags,
      featuredImage: post.featuredImage,
      publishedAt: post.publishedAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      status: post.status,
      views: post.views,
      likes: post.likes,
    }));

    return NextResponse.json(formattedPosts, { status: 200 });
  } catch (error: unknown) {
    console.error('Get posts by tag error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

