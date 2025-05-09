import User from "@/models/user";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username } = await req.json();

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const userExist = await User.findOne({ username });
    if (userExist) {
      return NextResponse.json({
        success: true,
        message: "Login Success",
        user: { username: userExist.username },
      });
    } else {
      const newUser = await User.create({ username });
      return NextResponse.json({
        success: true,
        message: "User Created",
        user: { username: newUser.username },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
