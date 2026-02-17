import { prisma } from "@/lib/prisma-client";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const updated = await prisma.customerAddress.update({
    where: { id: BigInt(params.id) },
    data: {
      fullName: body.fullName,
      phone: body.phone,
      provinceId: BigInt(body.provinceId),
      cityId: BigInt(body.cityId),
      zoneId: BigInt(body.zoneId),
      address: body.address,
      landmark: body.landmark,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
