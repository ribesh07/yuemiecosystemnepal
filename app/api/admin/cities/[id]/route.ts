import { prisma } from "@/prisma/prisma-client";
import { NextResponse, NextRequest } from "next/server";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context;

  try {
    const { city, shippingCost, applyShipping, provinceId } = await req.json();

    if (!city || city.trim() === "") {
      return NextResponse.json({ error: "City name is required" }, { status: 400 });
    }

    if (shippingCost === undefined || shippingCost < 0) {
      return NextResponse.json({ error: "Valid shipping cost is required" }, { status: 400 });
    }

    const updateData: any = {
      city: city.trim(),
      shippingCost: Number(shippingCost),
      applyShipping: Boolean(applyShipping),
      updatedAt: new Date(),
    };

    if (provinceId) updateData.provinceId = BigInt(provinceId);

    const updatedCity = await prisma.shippingCity.update({
      where: { id: BigInt(params.id) },
      data: updateData,
    });

    return NextResponse.json(updatedCity);
  } catch (error) {
    console.error("Error updating city:", error);
    return NextResponse.json({ error: "Failed to update city" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  const { params } = context;

  try {
    const zonesCount = await prisma.addressZone.count({
      where: { cityId: BigInt(params.id) },
    });

    if (zonesCount > 0) {
      return NextResponse.json({ error: "Cannot delete city with existing zones" }, { status: 400 });
    }

    await prisma.shippingCity.delete({
      where: { id: BigInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json({ error: "Failed to delete city" }, { status: 500 });
  }
}
