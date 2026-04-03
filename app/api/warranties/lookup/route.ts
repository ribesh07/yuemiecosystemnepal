import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { serializeBigInt } from "@/lib/serializeBigInt";

function formatWarrantyPeriod(daysInput: unknown) {
  const days = Number(daysInput || 365);
  if (!Number.isFinite(days) || days <= 0) return "365 Days";
  const years = Math.floor(days / 365);
  return years >= 1 ? `${years} Year${years > 1 ? "s" : ""}` : `${days} Days`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const serialNumber = String(body?.serialNumber || "").trim();
    const orderIdRaw = String(body?.orderId || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!serialNumber && !orderIdRaw) {
      return NextResponse.json(
        { success: false, message: "Serial number or order id is required" },
        { status: 400 }
      );
    }

    if (serialNumber) {
      const rows = (await prisma.$queryRawUnsafe(
        `
          SELECT pu.id, pu.serial_number as serialNumber, pu.product_code as productCode,
                 p.product_name as productName, p.categoryName as categoryName, p.warranty_days as warrantyDays,
                 w.purchase_date as purchaseDate, w.expiry_date as expiryDate, w.purchase_source as purchaseSource, w.customer_id as customerId,
                 u.full_name as customerName, u.email as customerEmail, u.phone as customerPhone,
                 CONCAT_WS(', ',
                   NULLIF(cab.address, ''),
                   NULLIF(cab.landmark, ''),
                   NULLIF(az.zone_name, ''),
                   NULLIF(sc.city, ''),
                   NULLIF(pr.province_name, '')
                 ) as customerAddress
          FROM product_units pu
          LEFT JOIN products p ON p.product_code = pu.product_code
          LEFT JOIN warranties w ON w.product_unit_id = pu.id
          LEFT JOIN users u ON u.id = w.customer_id
          LEFT JOIN customer_address_book cab ON cab.id = (
            SELECT cab2.id
            FROM customer_address_book cab2
            WHERE cab2.customer_id = u.id
            ORDER BY cab2.defaultShipping DESC, cab2.id DESC
            LIMIT 1
          )
          LEFT JOIN address_zone az ON az.id = cab.zone_id
          LEFT JOIN set_shipping sc ON sc.id = cab.city_id
          LEFT JOIN provinces pr ON pr.id = cab.province_id
          WHERE pu.serial_number = ?
          LIMIT 1
        `,
        serialNumber
      )) as any[];

      const row = rows?.[0] || null;

      if (!row) {
        return NextResponse.json(
          { success: false, message: "Serial number not found" },
          { status: 404 }
        );
      }

      const warrantyDays = Number(row?.warrantyDays || 365);
      const hasWarranty = Boolean(row?.purchaseDate && row?.expiryDate);

      if (!hasWarranty) {
        return NextResponse.json(
          {
            success: true,
            data: {
              status: "not_registered",
              serialNumber: row.serialNumber,
              productName: row.productName || null,
              productCode: row.productCode || null,
              categoryName: row.categoryName || null,
              warrantyDays,
              warrantyPeriod: formatWarrantyPeriod(warrantyDays),
            },
          },
          { status: 200 }
        );
      }

      const now = new Date();
      const expiryDate = new Date(row.expiryDate);
      const status = expiryDate >= now ? "active" : "expired";

      return NextResponse.json({
        success: true,
        data: serializeBigInt({
          status,
          serialNumber: row.serialNumber,
          productName: row.productName || null,
          productCode: row.productCode || null,
          categoryName: row.categoryName || null,
          purchaseDate: row.purchaseDate,
          expiryDate: row.expiryDate,
          warrantyDays,
          warrantyPeriod: formatWarrantyPeriod(warrantyDays),
          purchaseSource: row.purchaseSource,
          customerId: row.customerId || null,
          customerName: row.customerName || null,
          customerEmail: row.customerEmail || null,
          customerPhone: row.customerPhone || null,
          customerAddress: row.customerAddress || null,
        }),
      });
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required with order ID" },
        { status: 400 }
      );
    }

    const orderId = BigInt(orderIdRaw);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (email && order.user?.email?.toLowerCase() !== email) {
      return NextResponse.json(
        { success: false, message: "Email does not match order" },
        { status: 403 }
      );
    }

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
      ? "COALESCE(w.product_code, pu.product_code)"
      : "pu.product_code";

    const rows = (await prisma.$queryRawUnsafe(
      `
        SELECT w.purchase_date as purchaseDate, w.expiry_date as expiryDate, w.purchase_source as purchaseSource,
               pu.serial_number as serialNumber,
               p.product_name as productName, p.product_code as productCode, p.warranty_days as warrantyDays
        FROM warranties w
        LEFT JOIN product_units pu ON pu.id = w.product_unit_id
        LEFT JOIN products p ON p.product_code = ${productCodeExpr}
        WHERE w.order_id = ?
        ORDER BY w.id ASC
      `,
      orderId.toString()
    )) as any[];

    const now = new Date();
    const data = (rows || []).map((w) => {
      const expiry = new Date(w.expiryDate);
      return {
        status: expiry >= now ? "active" : "expired",
        serialNumber: w.serialNumber,
        productName: w.productName || null,
        productCode: w.productCode || null,
        purchaseDate: w.purchaseDate,
        expiryDate: w.expiryDate,
        warrantyDays: Number(w.warrantyDays || 365),
        warrantyPeriod: formatWarrantyPeriod(w.warrantyDays),
        purchaseSource: w.purchaseSource,
      };
    });

    return NextResponse.json({
      success: true,
      data: serializeBigInt({ orderId, items: data }),
    });
  } catch (error) {
    console.error("WARRANTY_LOOKUP_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to check warranty" },
      { status: 500 }
    );
  }
}
