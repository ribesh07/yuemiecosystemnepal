import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    if (payload.type !== "ADMIN") {
      return NextResponse.json({ valid: false }, { status: 403 });
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 403 });
  }
}
