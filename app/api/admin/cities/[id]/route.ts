import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

// BigInt JSON fix
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { city, shippingCost, applyShipping, provinceId } =
      await req.json();

    const updatedCity = await prisma.shippingCity.update({
      where: { id: BigInt(id) },
      data: {
        city: city?.trim(),
        shippingCost: Number(shippingCost),
        applyShipping: Boolean(applyShipping),
        provinceId: provinceId ? BigInt(provinceId) : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedCity);
  } catch (error) {
    console.error("Error updating city:", error);
    return NextResponse.json(
      { error: "Failed to update city" },
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

    await prisma.shippingCity.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json(
      { error: "Failed to delete city" },
      { status: 500 }
    );
  }
}
