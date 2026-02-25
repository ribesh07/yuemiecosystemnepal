import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdminRole("ADMIN");

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    return NextResponse.json(admins);
  } catch {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
}
