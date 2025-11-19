import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import mongoose from 'mongoose';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET - Get all published posts or posts by author
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const authorId = searchParams.get('authorId');
    const status = searchParams.get('status') || 'published';

    let query: any = {};
    if (authorId) {
      query.authorId = new mongoose.Types.ObjectId(authorId);
    }
    if (status) {
      query.status = status;
    }

    const posts = await Post.find(query)
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
    console.error('Get posts error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      authorId,
      authorName,
      authorEmail,
      tags,
      featuredImage,
      status = 'published',
    } = body;

    // Validate required fields
    if (!title || !content || !authorId || !authorName || !authorEmail) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Generate slug
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create post
    const post = await Post.create({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      slug,
      authorId: new mongoose.Types.ObjectId(authorId),
      authorName,
      authorEmail,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      featuredImage,
      status,
      publishedAt: status === 'published' ? new Date() : undefined,
      views: 0,
      likes: 0,
    });

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

    return NextResponse.json(formattedPost, { status: 201 });
  } catch (error: unknown) {
    console.error('Create post error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

