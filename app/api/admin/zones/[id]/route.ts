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
    const { zoneName, cityId } = await req.json();

    const updatedZone = await prisma.addressZone.update({
      where: { id: BigInt(id) },
      data: {
        zoneName,
        cityId: BigInt(cityId),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedZone);
  } catch {
    return NextResponse.json(
      { error: "Failed to update zone" },
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

    await prisma.addressZone.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete zone" },
      { status: 500 }
    );
  }
}
