import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const users = await User.find({}, { password: 0 }).limit(10);
    
    return NextResponse.json({
      success: true,
      userCount: users.length,
      users: users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}