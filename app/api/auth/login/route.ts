import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/prisma-client";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const requireEmailVerification =
    process.env.REQUIRE_EMAIL_VERIFICATION === "true";

  const { email, password } = await req.json();
  const safeEmail = email?.trim()?.toLowerCase();

  if (!safeEmail || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: safeEmail },
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  if (requireEmailVerification && !user.isEmailVerified) {
    return NextResponse.json(
      { message: "Please verify your email before login", code: "EMAIL_NOT_VERIFIED" },
      { status: 403 }
    );
  }

  if (!user.status) {
    return NextResponse.json(
      { message: "Your account is inactive. Contact support." },
      { status: 403 }
    );
  }

  const token = signToken({
    sub: user.id.toString(),
    role: "USER",
    type: "USER"
  });

  return NextResponse.json({ token });
}
