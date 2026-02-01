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


export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
   const { id } = await context.params;
  const userId = BigInt(id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...safeUserSelect,
      addresses: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(serializeBigInt(user));
}

