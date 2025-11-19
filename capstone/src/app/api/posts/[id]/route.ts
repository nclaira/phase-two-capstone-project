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

// GET - Get a single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await Post.findById(id).lean();

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
    console.error('Get post error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch post';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update fields
    if (body.title) {
      post.title = body.title;
      // Update slug if title changed
      post.slug = generateSlug(body.title);
    }
    if (body.content) post.content = body.content;
    if (body.excerpt !== undefined) post.excerpt = body.excerpt;
    if (body.tags) {
      post.tags = Array.isArray(body.tags)
        ? body.tags
        : body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
    if (body.featuredImage !== undefined) post.featuredImage = body.featuredImage;
    if (body.status) {
      post.status = body.status;
      if (body.status === 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }

    await post.save();

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
    console.error('Update post error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

