import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

export async function GET(req: Request) {
  try {
    await requireAdminRole();
    const { searchParams } = new URL(req.url);
    const productCode = searchParams.get("productCode")?.trim() || "";
    const statusRaw = searchParams.get("status")?.trim() || "";
    const status =
      statusRaw === "in_stock" || statusRaw === "sold" || statusRaw === "returned"
        ? statusRaw
        : "";

    let units: any[] = [];
    const prismaAny = prisma as any;

    if (prismaAny.productUnit?.findMany) {
      units = await prismaAny.productUnit.findMany({
        where: {
          ...(productCode ? { productCode } : {}),
          ...(status ? { status } : {}),
        },
        orderBy: { id: "desc" },
        include: {
          product: {
            select: { name: true, productCode: true },
          },
        },
      });
    } else {
      let sql = `
        SELECT pu.id, pu.product_code as productCode, pu.serial_number as serialNumber,
               pu.status, pu.created_at as createdAt,
               p.product_name as productName
        FROM product_units pu
        LEFT JOIN products p ON p.product_code = pu.product_code
        WHERE 1=1
      `;
      const args: any[] = [];
      if (productCode) {
        sql += " AND pu.product_code = ?";
        args.push(productCode);
      }
      if (status) {
        sql += " AND pu.status = ?";
        args.push(status);
      }
      sql += " ORDER BY pu.id DESC";
      const rows = await prisma.$queryRawUnsafe(sql, ...args);
      units = Array.isArray(rows)
        ? rows.map((row: any) => ({
            id: row.id,
            productCode: row.productCode,
            serialNumber: row.serialNumber,
            status: row.status,
            createdAt: row.createdAt,
            product: {
              name: row.productName,
              productCode: row.productCode,
            },
          }))
        : [];
    }

    return NextResponse.json({
      success: true,
      data: serializeBigInt(units),
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
    console.error("PRODUCT_UNITS_LIST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to load product units" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdminRole();
    const body = await req.json();
    const productCode = String(body?.productCode || "").trim();
    const serialNumbers = Array.isArray(body?.serialNumbers)
      ? body.serialNumbers.map((s: any) => String(s).trim()).filter(Boolean)
      : [];

    if (!productCode || !serialNumbers.length) {
      return NextResponse.json(
        { success: false, message: "Product code and serial numbers are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { productCode },
      select: { productCode: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    let createdCount = 0;
    const prismaAny = prisma as any;

    if (prismaAny.productUnit?.createMany) {
      const created = await prismaAny.productUnit.createMany({
        data: serialNumbers.map((serial: string) => ({
          productCode,
          serialNumber: serial,
          status: "in_stock",
        })),
        skipDuplicates: true,
      });
      createdCount = Number(created?.count || 0);
    } else {
      for (const serial of serialNumbers) {
        try {
          await prisma.$executeRawUnsafe(
            "INSERT INTO product_units (product_code, serial_number, status) VALUES (?, ?, 'in_stock')",
            productCode,
            serial
          );
          createdCount += 1;
        } catch {
          // Ignore duplicate serials for bulk insert behavior parity.
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Product units created",
      data: { count: createdCount },
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
    console.error("PRODUCT_UNITS_CREATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product units" },
      { status: 500 }
    );
  }
}
