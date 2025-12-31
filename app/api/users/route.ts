import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomCode } from "@/lib/randomCode";


// GET all users
export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(users);
}


type CreateUserInput = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
};

export async function POST(req: Request) {
  try {
    const body: CreateUserInput = await req.json();
    const { fullName, email, password, phone } = body;

    // ✅ Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "fullName, email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Check existing user
    const exists = await prisma.user.findUnique({
      where: { email }
    });

    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user (CONTROLLED DATA)
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        userId: randomCode('U'),
        password: hashedPassword,
        status: true
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        userId:true,
        phone: true,
        createdAt: true
      }
    });

    // ✅ Safe response
    return NextResponse.json(
      {
        ...user,
        id: user.id.toString(),
        createdAt: user.createdAt?.toISOString()
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
