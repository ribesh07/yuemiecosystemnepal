import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { serializeBigInt } from "@/lib/serializeBigInt";

 const safeUserSelect = {
  id: true,
  userId: true,
  fullName: true,
  email: true,
  phone: true,
  gender: true,
  status: true,
  orderCount: true,
  createdAt: true,
};


export async function GET() {
  const users = await prisma.user.findMany({
    select: safeUserSelect,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(serializeBigInt(users));
}
