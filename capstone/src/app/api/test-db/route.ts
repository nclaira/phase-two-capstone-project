import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

// Test endpoint to check MongoDB connection and list users
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing MongoDB connection...');
    await connectDB();
    
    const userCount = await User.countDocuments();
    const users = await User.find({}).select('-password').limit(10);
    
    return NextResponse.json(
      {
        success: true,
        message: 'MongoDB connection successful',
        userCount,
        users: users.map(user => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          bio: user.bio,
          createdAt: user.createdAt,
        })),
        collectionName: User.collection.name,
        databaseName: mongoose.connection.db?.databaseName || 'unknown',
        fullPath: `${mongoose.connection.db?.databaseName || 'unknown'}.${User.collection.name}`,
        note: `Look for collection "${User.collection.name}" in database "${mongoose.connection.db?.databaseName || 'unknown'}" in MongoDB Compass`,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('❌ MongoDB test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: 'Failed to connect to MongoDB. Please check your MONGODB_URI in .env.local',
      },
      { status: 500 }
    );
  }
}

