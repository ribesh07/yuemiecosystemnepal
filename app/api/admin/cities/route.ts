import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function GET() {
  const cities = await prisma.shippingCity.findMany({
    include: { province: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(cities);
}

export async function POST(req: Request) {
  const { city, shippingCost, provinceId } = await req.json();

  const newCity = await prisma.shippingCity.create({
    data: {
      city,
      shippingCost,
      provinceId: BigInt(provinceId),
    },
  });

  return NextResponse.json(newCity);
}
