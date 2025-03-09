import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token provided" }, { status: 400 });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 403 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "JWT Secret is missing" }, { status: 500 });
    }

    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET);

      const newAuthToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

      return NextResponse.json({ authToken: newAuthToken });
    } catch {
      return NextResponse.json({ message: "Refresh token expired" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
