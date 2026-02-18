import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await req.json();

    const updatedProvince = await prisma.province.update({
      where: { id: BigInt(params.id) },
      data: {
        name,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedProvince);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update province" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.province.delete({
      where: { id: BigInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete province" },
      { status: 500 }
    );
  }
}
