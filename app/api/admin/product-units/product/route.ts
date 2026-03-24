import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

export async function GET(req: Request) {
  try {
    await requireAdminRole();
    const { searchParams } = new URL(req.url);
    const productCode = searchParams.get("productCode")?.trim() || "";

    if (!productCode) {
      return NextResponse.json(
        { success: false, message: "Product code is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { productCode },
      include: {
        images: true,
        category: true,
        brand: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const rows = (await prisma.$queryRawUnsafe(
      "SELECT warranty_days as warrantyDays FROM products WHERE product_code = ? LIMIT 1",
      productCode
    )) as any[];

    const payload = {
      ...product,
      warrantyDays: Number(rows?.[0]?.warrantyDays || 365),
    };

    return NextResponse.json({
      success: true,
      data: serializeBigInt(payload),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }
    console.error("PRODUCT_UNITS_PRODUCT_DETAIL_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to load product details" },
      { status: 500 }
    );
  }
}

