import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};


export async function GET() {
  const zones = await prisma.addressZone.findMany({
    include: { city: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(zones);
}

export async function POST(req: Request) {
  const { zoneName, cityId } = await req.json();

  const zone = await prisma.addressZone.create({
    data: {
      zoneName,
      cityId: BigInt(cityId),
    },
  });

  return NextResponse.json(zone);
}
