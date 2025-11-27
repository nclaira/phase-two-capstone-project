import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('Login attempt started');
    await connectDB();
    console.log('Database connected successfully');

    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User found:', !!user);
    if (!user) {
      console.log('User not found for email:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
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
    console.error('Login error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      error
    });
    const errorMessage = error instanceof Error ? error.message : 'Failed to login';
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

