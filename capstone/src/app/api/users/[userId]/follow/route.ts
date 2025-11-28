import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await context.params;
    const { followingId } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(followingId)) {
      return NextResponse.json({ error: 'Invalid user IDs' }, { status: 400 });
    }

    if (userId === followingId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const follower = await User.findById(userId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize arrays if they don't exist
    if (!follower.following) follower.following = [];
    if (!following.followers) following.followers = [];

    const followingObjectId = new mongoose.Types.ObjectId(followingId);
    const followerObjectId = new mongoose.Types.ObjectId(userId);

    const isFollowing = follower.following.some((id: mongoose.Types.ObjectId) => id.equals(followingObjectId));

    if (isFollowing) {
      // Unfollow
      follower.following = follower.following.filter((id: mongoose.Types.ObjectId) => !id.equals(followingObjectId));
      following.followers = following.followers.filter((id: mongoose.Types.ObjectId) => !id.equals(followerObjectId));
    } else {
      // Follow
      follower.following.push(followingObjectId);
      following.followers.push(followerObjectId);
    }

    await follower.save();
    await following.save();

    return NextResponse.json({ 
      isFollowing: !isFollowing,
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully'
    });
  } catch (error) {
    console.error('Error toggling follow:', error);
    return NextResponse.json(
      { error: 'Failed to toggle follow' },
      { status: 500 }
    );
  }
}