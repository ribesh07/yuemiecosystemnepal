import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/prisma-client";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.password);

  if (!valid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
  const roleData = await prisma.adminRole.findUnique({
    where: {
      id: admin.roleId,
    },
  });

  if (!roleData) {
    return NextResponse.json(
      { message: "Admin role is not configured" },
      { status: 400 }
    );
  }

  const token = signToken({
    sub: admin.id.toString(),
    role: roleData.name,
    type: "ADMIN",
  });

  const res = NextResponse.json({ token });
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
