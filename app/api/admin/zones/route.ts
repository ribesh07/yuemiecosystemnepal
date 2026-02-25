import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";


export async function GET() {
  const zones = await prisma.addressZone.findMany({
    include: { city: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(serializeBigInt(zones));
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    await requireAdminRole();
  }

  const { zoneName, cityId } = await req.json();

  const zone = await prisma.addressZone.create({
    data: {
      zoneName,
      cityId: BigInt(cityId),
    },
  });

  return NextResponse.json(serializeBigInt(zone));
}
