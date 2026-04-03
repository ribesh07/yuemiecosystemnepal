import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAuth } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

export async function GET() {
  try {
    const user = await requireAuth();
    const customerId = BigInt(user.sub);

    const hasWarrantyProductCode = (
      (await prisma.$queryRawUnsafe(
        `
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = DATABASE()
            AND table_name = 'warranties'
            AND column_name = 'product_code'
          LIMIT 1
        `
      )) as any[]
    ).length > 0;

    const productCodeExpr = hasWarrantyProductCode
      ? "COALESCE(w.product_code, pu.product_code, oi.productCode)"
      : "COALESCE(pu.product_code, oi.productCode)";

    const rows = (await prisma.$queryRawUnsafe(
      `
        SELECT w.id, w.purchase_date as purchaseDate, w.expiry_date as expiryDate, w.purchase_source as purchaseSource,
               pu.serial_number as serialNumber,
               p.product_name as productName, p.product_code as productCode, p.warranty_days as warrantyDays,
               o.order_id as orderNumber
        FROM warranties w
        LEFT JOIN product_units pu ON pu.id = w.product_unit_id
        LEFT JOIN orders o ON o.id = w.order_id
        LEFT JOIN (
          SELECT oi.orderId, MIN(oi.id) as firstItemId
          FROM order_items oi
          GROUP BY oi.orderId
        ) oi_map ON oi_map.orderId = w.order_id
        LEFT JOIN order_items oi ON oi.id = oi_map.firstItemId
        LEFT JOIN products p ON p.product_code = ${productCodeExpr}
        WHERE (w.customer_id = ? OR o.customerId = ?)
        ORDER BY w.created_at DESC
      `,
      customerId.toString(),
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
