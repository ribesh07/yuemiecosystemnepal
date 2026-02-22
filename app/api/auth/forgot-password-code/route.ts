import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { generateOtpCode, saveUserOtp } from "@/lib/authOtp";
import { sendAuthCodeMail } from "@/lib/authMailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const safeEmail = email?.trim()?.toLowerCase();

    if (!safeEmail) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: safeEmail },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const otpCode = generateOtpCode();
    await saveUserOtp(user.id, "RESET_PASSWORD", otpCode, 10);

    await sendAuthCodeMail({
      to: safeEmail,
      subject: "Yuemi password reset code",
      text: `Your password reset code is ${otpCode}. It expires in 10 minutes.`,
      code: otpCode,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset code sent successfully",
    });
  } catch (error) {
    console.error("FORGOT_PASSWORD_CODE_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

