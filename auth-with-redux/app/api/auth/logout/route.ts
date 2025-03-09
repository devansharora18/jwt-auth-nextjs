import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    await connectToDatabase();

    await User.findByIdAndUpdate(userId, { refreshToken: null });

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
