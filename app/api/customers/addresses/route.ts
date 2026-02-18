import { prisma } from "@/prisma/prisma-client";
import { NextResponse, NextRequest } from "next/server";
import type { RouteHandler } from "next/dist/server/app-render";

// BigInt JSON fix
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// PUT handler
export const PUT: RouteHandler = async (req: NextRequest, context) => {
  try {
    const params = await context.params; // ✅ unwrap params
    const body = await req.json();

    const updatedAddress = await prisma.customerAddress.update({
      where: { id: BigInt(params.id) },
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
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
};

// DELETE handler
export const DELETE: RouteHandler = async (_: NextRequest, context) => {
  try {
    const params = await context.params; // ✅ unwrap params

    await prisma.customerAddress.delete({
      where: { id: BigInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
};
