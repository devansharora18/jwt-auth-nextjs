import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token provided" }, { status: 400 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "JWT Secret is missing" }, { status: 500 });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET) as { userId: string };

      const newAuthToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

      return NextResponse.json({ authToken: newAuthToken }, { status: 200 });
    } catch {
      return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
