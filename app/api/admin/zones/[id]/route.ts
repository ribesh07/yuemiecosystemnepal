import { prisma } from "@/prisma/prisma-client";
import { NextResponse, NextRequest } from "next/server";
import type { RouteHandler } from "next/dist/server/app-render";

// Fix BigInt JSON
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const PUT: RouteHandler = async (req: NextRequest, context) => {
  try {
    const params = await context.params; // ✅ unwrap params
    const { zoneName, cityId } = await req.json();

    const updatedZone = await prisma.addressZone.update({
      where: { id: BigInt(params.id) },
      data: {
        zoneName,
        cityId: BigInt(cityId),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedZone);
  } catch (error) {
    console.error("Error updating zone:", error);
    return NextResponse.json({ error: "Failed to update zone" }, { status: 500 });
  }
};

export const DELETE: RouteHandler = async (_: NextRequest, context) => {
  try {
    const params = await context.params; // ✅ unwrap params
    await prisma.addressZone.delete({
      where: { id: BigInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting zone:", error);
    return NextResponse.json({ error: "Failed to delete zone" }, { status: 500 });
  }
};
