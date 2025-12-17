import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    const profile = await prisma.user.findUnique({
      where: { id: BigInt(user.sub) },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true
      }
    });

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
