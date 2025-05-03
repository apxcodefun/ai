import Chat from "@/models/chat";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("user");
  if (!username) {
    return NextResponse.json({ error: "No username" }, { status: 400 });
  }
  const history = await Chat.find({ username, sender: "user" })
    .sort({ createdAt: -1 })
    .limit(50);
  return NextResponse.json(history);
}
