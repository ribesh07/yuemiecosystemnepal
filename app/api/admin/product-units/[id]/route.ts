import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";

function parseId(id: string) {
  try {
    return BigInt(id);
  } catch {
    return null;
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminRole();
    const { id } = await context.params;
    const unitId = parseId(id);
    if (!unitId) {
      return NextResponse.json(
        { success: false, message: "Invalid unit id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const serialNumber = String(body?.serialNumber || "").trim();
    const status = String(body?.status || "").trim();
    const allowedStatus = ["in_stock", "sold", "returned"];

    if (!serialNumber && !status) {
      return NextResponse.json(
        { success: false, message: "Nothing to update" },
        { status: 400 }
      );
    }

    if (status && !allowedStatus.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const existing = (await prisma.$queryRawUnsafe(
      "SELECT id FROM product_units WHERE id = ? LIMIT 1",
      unitId.toString()
    )) as any[];
    if (!existing?.[0]) {
      return NextResponse.json(
        { success: false, message: "Product unit not found" },
        { status: 404 }
      );
    }

    let sql = "UPDATE product_units SET ";
    const args: any[] = [];
    const sets: string[] = [];
    if (serialNumber) {
      sets.push("serial_number = ?");
      args.push(serialNumber);
    }
    if (status) {
      sets.push("status = ?");
      args.push(status);
    }
    sql += sets.join(", ");
    sql += " WHERE id = ?";
    args.push(unitId.toString());
    await prisma.$executeRawUnsafe(sql, ...args);

    const updated = (await prisma.$queryRawUnsafe(
      `
        SELECT pu.id, pu.product_code as productCode, pu.serial_number as serialNumber,
               pu.status, pu.created_at as createdAt, p.product_name as productName
        FROM product_units pu
        LEFT JOIN products p ON p.product_code = pu.product_code
        WHERE pu.id = ?
        LIMIT 1
      `,
      unitId.toString()
    )) as any[];

    return NextResponse.json({
      success: true,
      message: "Product unit updated",
      data: updated?.[0] || null,
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
    console.error("PRODUCT_UNIT_UPDATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product unit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminRole();
    const { id } = await context.params;
    const unitId = parseId(id);
    if (!unitId) {
      return NextResponse.json(
        { success: false, message: "Invalid unit id" },
        { status: 400 }
      );
    }

    const linkedOrderItem = (await prisma.$queryRawUnsafe(
      "SELECT id FROM order_items WHERE product_unit_id = ? LIMIT 1",
      unitId.toString()
    )) as any[];
    if (linkedOrderItem?.[0]) {
      return NextResponse.json(
        {
          success: false,
          message: "This unit is already linked to an order and cannot be deleted",
        },
        { status: 400 }
      );
    }

    await prisma.$executeRawUnsafe(
      "DELETE FROM warranties WHERE product_unit_id = ?",
      unitId.toString()
    );
    await prisma.$executeRawUnsafe(
      "DELETE FROM product_units WHERE id = ?",
      unitId.toString()
    );

    return NextResponse.json({
      success: true,
      message: "Product unit deleted",
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
    console.error("PRODUCT_UNIT_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product unit" },
      { status: 500 }
    );
  }
}
