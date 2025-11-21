import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  const { slug } = context.params;

  try {
    // fetch your post using slug
    return NextResponse.json({ message: "success", slug });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
