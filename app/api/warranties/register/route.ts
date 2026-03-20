import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAuth } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const serialNumber = String(body?.serialNumber || "").trim();
    const purchaseDateRaw = body?.purchaseDate ? new Date(body.purchaseDate) : null;
    const purchaseSource = body?.purchaseSource === "online" ? "online" : "store";

    if (!serialNumber) {
      return NextResponse.json(
        { success: false, message: "Serial number is required" },
        { status: 400 }
      );
    }

    const prismaAny = prisma as any;
    const unit = prismaAny.productUnit?.findUnique
      ? await prismaAny.productUnit.findUnique({
          where: { serialNumber },
          include: {
            product: {
              select: { name: true, productCode: true },
            },
            warranty: true,
          },
        })
      : null;

    let unitInfo: any = unit;
    let warrantyDays = 365;
    let existingWarranty: any = unit?.warranty || null;

    if (!unitInfo) {
      const rows = (await prisma.$queryRawUnsafe(
        `
          SELECT pu.id, pu.serial_number as serialNumber, pu.product_code as productCode,
                 pu.status as unitStatus,
                 p.product_name as productName, p.warranty_days as warrantyDays
          FROM product_units pu
          JOIN products p ON p.product_code = pu.product_code
          WHERE pu.serial_number = ?
          LIMIT 1
        `,
        serialNumber
      )) as any[];

      unitInfo = rows?.[0] || null;
      warrantyDays = Number(unitInfo?.warrantyDays || 365);

      if (unitInfo?.id) {
        const existing = (await prisma.$queryRawUnsafe(
          "SELECT id FROM warranties WHERE product_unit_id = ? LIMIT 1",
          unitInfo.id
        )) as any[];
        existingWarranty = existing?.[0] || null;
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

    const currentStatus = String(unitInfo?.status || unitInfo?.unitStatus || "").toLowerCase();
    if (currentStatus && currentStatus !== "in_stock") {
      return NextResponse.json(
        {
          success: false,
          message:
            currentStatus === "sold"
              ? "This serial number is already sold/registered"
              : `This serial number is not available for registration (${currentStatus})`,
        },
        { status: 400 }
      );
    }

    if (existingWarranty) {
      return NextResponse.json({
        success: true,
        message: "Warranty already registered",
        data: serializeBigInt(existingWarranty),
      });
    }

    let customerId: bigint | null = null;
    try {
      const user = await requireAuth();
      customerId = BigInt(user.sub);
    } catch {
      customerId = null;
    }

    const purchaseDate = purchaseDateRaw && !Number.isNaN(purchaseDateRaw.valueOf())
      ? purchaseDateRaw
      : new Date();
    const days = Number(warrantyDays || 365);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + days);

    let warranty: any = null;
    if (prismaAny.warranty?.create) {
      warranty = await prismaAny.warranty.create({
        data: {
          productUnitId: unitInfo.id,
          orderId: null,
          customerId,
          purchaseDate,
          expiryDate,
          purchaseSource,
        },
      });
    } else {
      await prisma.$executeRawUnsafe(
        `
          INSERT INTO warranties
          (product_unit_id, order_id, customer_id, purchase_date, expiry_date, purchase_source)
          VALUES (?, NULL, ?, ?, ?, ?)
        `,
        unitInfo.id,
        customerId ? customerId.toString() : null,
        purchaseDate,
        expiryDate,
        purchaseSource
      );
      const createdRows = (await prisma.$queryRawUnsafe(
        "SELECT * FROM warranties WHERE product_unit_id = ? LIMIT 1",
        unitInfo.id
      )) as any[];
      warranty = createdRows?.[0] || null;
    }

    await prisma.$executeRawUnsafe(
      "UPDATE product_units SET status = 'sold' WHERE id = ?",
      unitInfo.id.toString()
    );
    await prisma.$executeRawUnsafe(
      "UPDATE products SET availableQuantity = GREATEST(availableQuantity - 1, 0) WHERE product_code = ?",
      unitInfo.product?.productCode || unitInfo.productCode
    );

    return NextResponse.json({
      success: true,
      message: "Warranty registered successfully",
      data: serializeBigInt({
        warranty,
        product: {
          name: unitInfo.product?.name || unitInfo.productName || null,
          productCode: unitInfo.product?.productCode || unitInfo.productCode || null,
        },
      }),
    });
  } catch (error) {
    console.error("WARRANTY_REGISTER_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to register warranty" },
      { status: 500 }
    );
  }
}
