import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/prisma-client";
import { verifyUserOtp } from "@/lib/authOtp";

export async function POST(req: Request) {
  try {
    const { email, reset_code, new_password, confirm_new_password } =
      await req.json();
    const safeEmail = email?.trim()?.toLowerCase();
    const code = String(reset_code || "").trim();
    const newPassword = String(new_password || "");
    const confirmPassword = String(confirm_new_password || "");

    if (!safeEmail || !code || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
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
      "RESET_PASSWORD",
      code
    );

    if (!validCode) {
      return NextResponse.json(
        { message: "Invalid or expired reset code" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        rememberToken: null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("RESET_PASSWORD_VERIFY_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

