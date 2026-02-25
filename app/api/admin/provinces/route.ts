import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";


export async function GET() {
  const provinces = await prisma.province.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(serializeBigInt(provinces));
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    await requireAdminRole();
  }

  const { name } = await req.json();

  const province = await prisma.province.create({
    data: { name },
  });

  return NextResponse.json(serializeBigInt(province));
}
