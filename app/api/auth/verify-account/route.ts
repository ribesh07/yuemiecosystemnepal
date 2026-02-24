import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { verifyUserOtp } from "@/lib/authOtp";

export async function POST(req: Request) {
  try {
    const { email, user_verification_code } = await req.json();
    const safeEmail = email?.trim()?.toLowerCase();
    const code = String(user_verification_code || "").trim();

    if (!safeEmail || !code) {
      return NextResponse.json(
        { message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: safeEmail },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const validCode = await verifyUserOtp(
      user.rememberToken,
      "VERIFY_EMAIL",
      code
    );

    if (!validCode) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        status: true,
        rememberToken: null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    console.error("VERIFY_ACCOUNT_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

