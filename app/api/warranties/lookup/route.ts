import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { serializeBigInt } from "@/lib/serializeBigInt";

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
      const prismaAny = prisma as any;
      const unit = prismaAny.productUnit?.findUnique
        ? await prismaAny.productUnit.findUnique({
            where: { serialNumber },
            include: {
              product: {
                select: {
                  name: true,
                  productCode: true,
                },
              },
              warranty: true,
            },
          })
        : null;

      let unitInfo: any = unit;
      let warranty: any = unit?.warranty || null;
      let warrantyDays = 365;

      if (!unitInfo) {
        const rows = (await prisma.$queryRawUnsafe(
          `
            SELECT pu.id, pu.serial_number as serialNumber, pu.product_code as productCode,
                   p.product_name as productName, p.warranty_days as warrantyDays
            FROM product_units pu
            LEFT JOIN products p ON p.product_code = pu.product_code
            WHERE pu.serial_number = ?
            LIMIT 1
          `,
          serialNumber
        )) as any[];
        unitInfo = rows?.[0] || null;
        warrantyDays = Number(unitInfo?.warrantyDays || 365);
        if (unitInfo?.id) {
          const warrantyRows = (await prisma.$queryRawUnsafe(
            "SELECT * FROM warranties WHERE product_unit_id = ? LIMIT 1",
            unitInfo.id
          )) as any[];
          warranty = warrantyRows?.[0] || null;
        }
      } else {
        const wdRows = (await prisma.$queryRawUnsafe(
          "SELECT warranty_days as warrantyDays FROM products WHERE product_code = ? LIMIT 1",
          unitInfo.productCode
        )) as any[];
        warrantyDays = Number(wdRows?.[0]?.warrantyDays || 365);
      }

      if (!unitInfo) {
        return NextResponse.json(
          { success: false, message: "Serial number not found" },
          { status: 404 }
        );
      }

      if (!warranty) {
        return NextResponse.json(
          {
            success: true,
            data: {
              status: "not_registered",
              serialNumber: unitInfo.serialNumber,
              productName: unitInfo.product?.name || unitInfo.productName || null,
              productCode: unitInfo.product?.productCode || unitInfo.productCode || null,
            },
          },
          { status: 200 }
        );
      }

      const now = new Date();
      const expiryDate = new Date(warranty.expiryDate);
      const status = expiryDate >= now ? "active" : "expired";

      return NextResponse.json({
        success: true,
        data: serializeBigInt({
          status,
          serialNumber: unitInfo.serialNumber,
          productName: unitInfo.product?.name || unitInfo.productName || null,
          productCode: unitInfo.product?.productCode || unitInfo.productCode || null,
          purchaseDate: warranty.purchaseDate,
          expiryDate: warranty.expiryDate,
          warrantyDays,
          purchaseSource: warranty.purchaseSource || warranty.purchase_source,
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

    const rows = (await prisma.$queryRawUnsafe(
      `
        SELECT w.purchase_date as purchaseDate, w.expiry_date as expiryDate, w.purchase_source as purchaseSource,
               pu.serial_number as serialNumber,
               p.product_name as productName, p.product_code as productCode, p.warranty_days as warrantyDays
        FROM warranties w
        JOIN product_units pu ON pu.id = w.product_unit_id
        LEFT JOIN products p ON p.product_code = pu.product_code
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
