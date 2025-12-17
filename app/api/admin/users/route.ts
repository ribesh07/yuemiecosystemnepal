import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";

export async function GET() {
  try {
    requireAdminRole("SUPER_ADMIN");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true
      }
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
}
