import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAuth } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

export async function GET() {
  try {
    const user = await requireAuth();
    const customerId = BigInt(user.sub);

    const rows = (await prisma.$queryRawUnsafe(
      `
        SELECT w.id, w.purchase_date as purchaseDate, w.expiry_date as expiryDate, w.purchase_source as purchaseSource,
               pu.serial_number as serialNumber,
               p.product_name as productName, p.product_code as productCode, p.warranty_days as warrantyDays,
               o.order_id as orderNumber
        FROM warranties w
        JOIN product_units pu ON pu.id = w.product_unit_id
        LEFT JOIN products p ON p.product_code = pu.product_code
        LEFT JOIN orders o ON o.id = w.order_id
        WHERE w.customer_id = ?
        ORDER BY w.created_at DESC
      `,
      customerId.toString()
    )) as any[];

    const now = new Date();
    const data = (rows || []).map((w) => ({
      id: w.id,
      status: new Date(w.expiryDate) >= now ? "active" : "expired",
      serialNumber: w.serialNumber,
      productName: w.productName || null,
      productCode: w.productCode || null,
      orderNumber: w.orderNumber || null,
      purchaseDate: w.purchaseDate,
      expiryDate: w.expiryDate,
      warrantyDays: Number(w.warrantyDays || 365),
      purchaseSource: w.purchaseSource,
    }));

    return NextResponse.json({
      success: true,
      data: serializeBigInt(data),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("WARRANTY_LIST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to load warranties" },
      { status: 500 }
    );
  }
}
