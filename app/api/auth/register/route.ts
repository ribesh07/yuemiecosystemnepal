import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/prisma-client";
import { randomCode } from "@/lib/randomCode";

export async function POST(req: Request) {
  try {
    const {name, email, password } = await req.json();

    // 1️⃣ Validate input
    if (!email || !password ) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    // 2️⃣ Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await prisma.user.create({
      data: {
        fullName : name,
        email: email,
        password: hashedPassword,
        userId: randomCode('U'),
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          userId: user.id,
          mobile: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
