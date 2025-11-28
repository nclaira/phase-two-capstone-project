import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await context.params;
    const { searchParams } = new URL(request.url);
    const followingId = searchParams.get('followingId');

    if (!mongoose.Types.ObjectId.isValid(userId) || !followingId || !mongoose.Types.ObjectId.isValid(followingId)) {
      return NextResponse.json({ isFollowing: false });
    }

    const user = await User.findById(userId);
    if (!user || !user.following) {
      return NextResponse.json({ isFollowing: false });
    }

    const followingObjectId = new mongoose.Types.ObjectId(followingId);
    const isFollowing = user.following.some((id: mongoose.Types.ObjectId) => id.equals(followingObjectId));

    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json({ isFollowing: false });
  }
}