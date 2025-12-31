

import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token)
    return NextResponse.json({ valid: false }, { status: 401 });

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 403 });
  }
}
