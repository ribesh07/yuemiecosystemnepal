import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

export async function GET(req: Request) {
  try {
    await requireAdminRole();
    const { searchParams } = new URL(req.url);
    const serialNumber = searchParams.get("serial")?.trim();
    const orderIdRaw = searchParams.get("orderId")?.trim();
    const email = searchParams.get("email")?.trim().toLowerCase();
    const status = searchParams.get("status")?.trim().toLowerCase();

    const orderId = orderIdRaw ? BigInt(orderIdRaw) : null;
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

    let sql = `
      SELECT w.id, w.purchase_date as purchaseDate, w.expiry_date as expiryDate, w.purchase_source as purchaseSource,
             pu.serial_number as serialNumber,
             p.product_name as productName, p.product_code as productCode, p.warranty_days as warrantyDays,
             o.order_id as orderNumber,
             COALESCE(u.id, ou.id) as customerId,
             COALESCE(u.full_name, ou.full_name) as customerName,
             COALESCE(u.email, ou.email) as customerEmail,
             COALESCE(u.phone, ou.phone) as customerPhone,
             CONCAT_WS(', ',
               NULLIF(cab.address, ''),
               NULLIF(cab.landmark, ''),
               NULLIF(az.zone_name, ''),
               NULLIF(sc.city, ''),
               NULLIF(pr.province_name, '')
             ) as customerAddress
      FROM warranties w
      LEFT JOIN product_units pu ON pu.id = w.product_unit_id
      LEFT JOIN orders o ON o.id = w.order_id
      LEFT JOIN users ou ON ou.id = o.customerId
      LEFT JOIN (
        SELECT oi.orderId, MIN(oi.id) as firstItemId
        FROM order_items oi
        GROUP BY oi.orderId
      ) oi_map ON oi_map.orderId = w.order_id
      LEFT JOIN order_items oi ON oi.id = oi_map.firstItemId
      LEFT JOIN products p ON p.product_code = ${productCodeExpr}
      LEFT JOIN users u ON u.id = w.customer_id
      LEFT JOIN customer_address_book cab ON cab.id = (
        SELECT cab2.id
        FROM customer_address_book cab2
        WHERE cab2.customer_id = COALESCE(u.id, ou.id)
        ORDER BY cab2.defaultShipping DESC, cab2.id DESC
        LIMIT 1
      )
      LEFT JOIN address_zone az ON az.id = cab.zone_id
      LEFT JOIN set_shipping sc ON sc.id = cab.city_id
      LEFT JOIN provinces pr ON pr.id = cab.province_id
      WHERE 1=1
    `;
    const args: any[] = [];
    if (orderId) {
      sql += " AND w.order_id = ?";
      args.push(orderId.toString());
    }
    if (email) {
      sql += " AND LOWER(COALESCE(u.email, ou.email)) = ?";
      args.push(email);
    }
    if (serialNumber) {
      sql += " AND pu.serial_number = ?";
      args.push(serialNumber);
    }
    sql += " ORDER BY w.created_at DESC";

    const rows = (await prisma.$queryRawUnsafe(sql, ...args)) as any[];

    const now = new Date();
    let data = (rows || []).map((w) => ({
      id: w.id,
      status: new Date(w.expiryDate) >= now ? "active" : "expired",
      serialNumber: w.serialNumber,
      productName: w.productName || null,
      productCode: w.productCode || null,
      orderNumber: w.orderNumber || null,
      customerName: w.customerName || null,
      customerEmail: w.customerEmail || null,
      customerPhone: w.customerPhone || null,
      customerAddress: w.customerAddress || null,
      purchaseDate: w.purchaseDate,
      expiryDate: w.expiryDate,
      warrantyDays: Number(w.warrantyDays || 365),
      purchaseSource: w.purchaseSource,
    }));

    if (status && status !== "all") {
      data = data.filter((item) => item.status === status);
    }

    return NextResponse.json({
      success: true,
      data: serializeBigInt(data),
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
    console.error("ADMIN_WARRANTY_LIST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to load warranties" },
      { status: 500 }
    );
  }
}
