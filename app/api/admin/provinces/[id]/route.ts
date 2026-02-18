import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { name } = await req.json();

    const updatedProvince = await prisma.province.update({
      where: { id: BigInt(id) },
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
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.province.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete province" },
      { status: 500 }
    );
  }
}
