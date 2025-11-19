import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Signup request received');
    await connectDB();
    console.log('✅ Database connected, processing signup...');

    const { name, email, password } = await request.json();
    console.log('👤 Signing up user:', email);

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    console.log('✅ User created successfully in MongoDB');
    console.log('📋 User ID:', user._id.toString());
    console.log('📋 User Email:', user.email);
    const dbName = mongoose.connection.db?.databaseName || 'unknown';
    console.log('📋 Database:', dbName);
    console.log('📋 Collection:', User.collection.name);
    console.log('📋 Full Collection Path:', `${dbName}.${User.collection.name}`);

    // Return user data (without password)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
    };

    return NextResponse.json(
      {
        user: userData,
        message: 'User created successfully',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

