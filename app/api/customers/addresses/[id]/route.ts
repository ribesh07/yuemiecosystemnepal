import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

// Fix BigInt JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const updatedAddress = await prisma.customerAddress.update({
      where: { id: BigInt(id) },
      data: {
        customerId: BigInt(body.customerId),
        fullName: body.fullName,
        phone: body.phone,
        provinceId: BigInt(body.provinceId),
        cityId: BigInt(body.cityId),
        zoneId: BigInt(body.zoneId),
        address: body.address,
        landmark: body.landmark,
        addressType: body.addressType || "HOME",
        defaultShipping: body.defaultShipping || false,
        defaultBilling: body.defaultBilling || false,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
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

    await prisma.customerAddress.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
