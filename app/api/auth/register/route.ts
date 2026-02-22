import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/prisma-client";
import { randomCode } from "@/lib/randomCode";
import { generateOtpCode, saveUserOtp } from "@/lib/authOtp";
import { sendAuthCodeMail } from "@/lib/authMailer";

export async function POST(req: Request) {
  try {
    const requireEmailVerification =
      process.env.REQUIRE_EMAIL_VERIFICATION === "true";

    const {
      name,
      email,
      password,
      phone,
    }: { name?: string; email?: string; password?: string; phone?: string } =
      await req.json();

    const safeEmail = email?.trim().toLowerCase();
    const safePhone = phone?.trim();

    if (!name || !safeEmail || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: safeEmail },
    });

    if (safePhone) {
      const existingPhoneUser = await prisma.user.findFirst({
        where: {
          phone: safePhone,
          ...(existingUser
            ? {
                id: { not: existingUser.id },
              }
            : {}),
        },
      });

      if (existingPhoneUser) {
        return NextResponse.json(
          { message: "Phone is already in use" },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = existingUser;

    if (existingUser && existingUser.isEmailVerified) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: name,
          email: safeEmail,
          phone: safePhone,
          password: hashedPassword,
          userId: randomCode("U"),
          status: !requireEmailVerification,
          isEmailVerified: !requireEmailVerification,
          ...(requireEmailVerification
            ? {}
            : {
                emailVerifiedAt: new Date(),
              }),
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          fullName: name,
          phone: safePhone,
          password: hashedPassword,
          status: !requireEmailVerification,
          isEmailVerified: !requireEmailVerification,
          emailVerifiedAt: requireEmailVerification ? null : new Date(),
        },
      });
    }

    if (requireEmailVerification) {
      const otpCode = generateOtpCode();
      await saveUserOtp(user.id, "VERIFY_EMAIL", otpCode, 10);

      await sendAuthCodeMail({
        to: safeEmail,
        subject: "Verify your Yuemi account",
        text: `Your verification code is ${otpCode}. It expires in 10 minutes.`,
        code: otpCode,
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          rememberToken: null,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: requireEmailVerification
          ? "User registered successfully. Verification code sent to email."
          : "User registered successfully. You can login now.",
        requiresVerification: requireEmailVerification,
        data: {
          userId: user.userId,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
