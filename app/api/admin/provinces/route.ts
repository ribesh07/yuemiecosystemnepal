import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function GET() {
  const provinces = await prisma.province.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(provinces);
}

export async function POST(req: Request) {
  const { name } = await req.json();

  const province = await prisma.province.create({
    data: { name },
  });

  return NextResponse.json(province);
}
