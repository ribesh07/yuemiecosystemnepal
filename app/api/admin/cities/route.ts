import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";


export async function GET() {
  const cities = await prisma.shippingCity.findMany({
    include: { province: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(serializeBigInt(cities));
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    await requireAdminRole();
  }

  const { city, shippingCost, provinceId } = await req.json();

  const newCity = await prisma.shippingCity.create({
    data: {
      city,
      shippingCost,
      provinceId: BigInt(provinceId),
    },
  });

  return NextResponse.json(serializeBigInt(newCity));
}
