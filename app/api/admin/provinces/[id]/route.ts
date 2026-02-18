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
    console.error("Error updating province:", error);
    return NextResponse.json({ error: "Failed to update province" }, { status: 500 });
  }
};

export const DELETE: RouteHandler = async (_: NextRequest, context) => {
  try {
    const params = await context.params; // ✅ unwrap params
    await prisma.province.delete({
      where: { id: BigInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting province:", error);
    return NextResponse.json({ error: "Failed to delete province" }, { status: 500 });
  }
};
