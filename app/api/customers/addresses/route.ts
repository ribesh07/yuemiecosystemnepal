import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function GET(req: Request) {
  const userId = 1; // replace with real session user id

  const addresses = await prisma.customerAddress.findMany({
    where: { customerId: BigInt(userId) },
    include: {
      province: true,
      city: true,
      zone: true,
    },
  });

  return NextResponse.json(addresses);
}
