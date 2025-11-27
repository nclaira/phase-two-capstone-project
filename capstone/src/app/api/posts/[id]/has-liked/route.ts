import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
  try {
    const { id } = await params; // Await the params
    console.log('Post ID:', id);
    
    // Your logic here to check if user has liked the post
    // This is just example logic - replace with your actual implementation
    const hasLiked = false;
    
    return NextResponse.json({ hasLiked });
  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
