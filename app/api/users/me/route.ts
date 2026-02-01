import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { requireAuth } from "@/lib/auth";
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
  try {
    const user = await requireAuth();

     const profile = await prisma.user.findUnique({
     where: { id: BigInt(user.sub) },
    select: {
      ...safeUserSelect,
      addresses: true,
    },  
  });  


    return NextResponse.json(serializeBigInt(user));
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }  
}  


