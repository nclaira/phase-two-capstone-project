import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

// GET - Get a post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const { slug } = params;

    const post = await Post.findOne({ slug }).lean();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const formattedPost = {
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
    };

    return NextResponse.json(formattedPost, { status: 200 });
  } catch (error: unknown) {
    console.error('Get post by slug error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch post';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

