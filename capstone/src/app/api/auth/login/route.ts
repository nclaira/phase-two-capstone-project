import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user data (without password)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
    };

    // Generate a simple token (in production, use JWT)
    const token = `token-${user._id}-${Date.now()}`;

    return NextResponse.json(
      {
        user: userData,
        token,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to login';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

