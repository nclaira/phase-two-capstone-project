import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { userId } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Initialize likedBy array if it doesn't exist
    if (!post.likedBy) {
      post.likedBy = [];
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hasLiked = post.likedBy.some((id: mongoose.Types.ObjectId) => id.equals(userObjectId));

    if (hasLiked) {
      // Unlike: remove user from likedBy array
      post.likedBy = post.likedBy.filter((id: mongoose.Types.ObjectId) => !id.equals(userObjectId));
      post.likes = Math.max(0, (post.likes || 0) - 1);
    } else {
      // Like: add user to likedBy array
      post.likedBy.push(userObjectId);
      post.likes = (post.likes || 0) + 1;
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

    return NextResponse.json({ 
      liked: !hasLiked,
      post: formattedPost
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}