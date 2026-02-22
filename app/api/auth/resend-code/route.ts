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

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Account already verified" },
        { status: 400 }
      );
    }

    const otpCode = generateOtpCode();
    await saveUserOtp(user.id, "VERIFY_EMAIL", otpCode, 10);

    await sendAuthCodeMail({
      to: safeEmail,
      subject: "Your new Yuemi verification code",
      text: `Your verification code is ${otpCode}. It expires in 10 minutes.`,
      code: otpCode,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code resent successfully",
    });
  } catch (error) {
    console.error("RESEND_CODE_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

