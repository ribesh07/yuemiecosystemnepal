import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

// GET all users
export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(users);
}

// CREATE user
export async function POST(req: Request) {
  const body = await req.json();
  const { email, name } = body;

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: { email, name },
  });

  return NextResponse.json(user, { status: 201 });
}
