import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { sendMail } from "@/lib/mailer";
import { buildReturnStatusEmail } from "@/lib/orderEmail";

function parseId(value: string) {
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

async function hasColumn(tableName: string, columnName: string) {
  try {
    const rows = (await prisma.$queryRawUnsafe(
      `
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = ?
          AND column_name = ?
        LIMIT 1
      `,
      tableName,
      columnName
    )) as any[];
    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminRole();

    if (!(prisma as any).returnRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Return table is not ready. Run prisma migrate/generate and restart server.",
        },
        { status: 500 }
      );
    }

    const { id } = await context.params;
    const returnId = parseId(id);

    if (!returnId) {
      return NextResponse.json(
        { success: false, message: "Invalid return request id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const nextStatus = String(body?.status || "").toLowerCase().trim();
    const courierName = body?.courierName
      ? String(body.courierName).trim()
      : "";
    const cnNumber = body?.cnNumber
      ? String(body.cnNumber).trim()
      : "";
    const cnDateRaw = body?.cnDate
      ? String(body.cnDate).trim()
      : "";
    const cnDate = cnDateRaw ? new Date(cnDateRaw) : null;
    const serialNumber = body?.serialNumber
      ? String(body.serialNumber).trim()
      : "";
    const remark = body?.remark
      ? String(body.remark).trim()
      : "";

    if (!nextStatus || !["new", "shipped", "cancelled"].includes(nextStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    if (nextStatus === "shipped" && !courierName) {
      return NextResponse.json(
        { success: false, message: "Courier name is required for shipped status" },
        { status: 400 }
      );
    }

    if (cnDateRaw && (!cnDate || Number.isNaN(cnDate.valueOf()))) {
      return NextResponse.json(
        { success: false, message: "Invalid CN date" },
        { status: 400 }
      );
    }

    const current = await (prisma as any).returnRequest.findUnique({
      where: { id: returnId },
      include: {
        user: true,
        order: true,
        product: true,
      },
    });

    if (!current) {
      return NextResponse.json(
        { success: false, message: "Return request not found" },
        { status: 404 }
      );
    }

    const currentStatus = String(current.status || "new").toLowerCase();
    const isTerminal = currentStatus === "shipped" || currentStatus === "cancelled";
    if (isTerminal && currentStatus !== nextStatus) {
      return NextResponse.json(
        {
          success: false,
          message: `Status is locked after ${currentStatus}`,
        },
        { status: 400 }
      );
    }

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS order_update_logs (
        id BIGINT NOT NULL AUTO_INCREMENT,
        order_id BIGINT NOT NULL,
        admin_id BIGINT NULL,
        event_type VARCHAR(50) NOT NULL,
        from_order_status VARCHAR(50) NULL,
        to_order_status VARCHAR(50) NULL,
        from_payment_status VARCHAR(50) NULL,
        to_payment_status VARCHAR(50) NULL,
        courier_name VARCHAR(191) NULL,
        cancel_reason TEXT NULL,
        payment_mode VARCHAR(50) NULL,
        transaction_id VARCHAR(191) NULL,
        cn_number VARCHAR(191) NULL,
        cn_date DATE NULL,
        remark TEXT NULL,
        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id),
        INDEX idx_order_update_logs_order_id (order_id),
        INDEX idx_order_update_logs_event_type (event_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    if (!(await hasColumn("order_update_logs", "cn_number"))) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE order_update_logs ADD COLUMN cn_number VARCHAR(191) NULL AFTER transaction_id"
      );
    }
    if (!(await hasColumn("order_update_logs", "cn_date"))) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE order_update_logs ADD COLUMN cn_date DATE NULL AFTER cn_number"
      );
    }

    const adminId = admin?.sub ? BigInt(admin.sub) : null;
    const updated = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
      const changed = await (tx as any).returnRequest.update({
        where: { id: returnId },
        data: { status: nextStatus, updatedAt: new Date() },
      });

      if (nextStatus === "shipped" || nextStatus === "cancelled") {
        await tx.order.update({
          where: { id: current.orderId },
          data: {
            orderStatus: nextStatus,
            updatedAt: new Date(),
          },
        });
      }

      let finalRemark = remark;
      if (nextStatus === "shipped" && serialNumber) {
        const unitRows = (await tx.$queryRawUnsafe(
          `
            SELECT id, product_code as productCode, status
            FROM product_units
            WHERE serial_number = ?
            LIMIT 1
          `,
          serialNumber
        )) as any[];
        const selectedUnit = unitRows?.[0];
        if (!selectedUnit) {
          throw new Error("SERIAL_NOT_FOUND");
        }
        if (String(selectedUnit.status || "").toLowerCase() !== "in_stock") {
          throw new Error("SERIAL_NOT_AVAILABLE");
        }
        if (
          current.productCode &&
          String(selectedUnit.productCode || "") !== String(current.productCode)
        ) {
          throw new Error("SERIAL_NOT_MATCH_PRODUCT");
        }

        await tx.$executeRawUnsafe(
          "UPDATE product_units SET status = 'sold' WHERE id = ?",
          String(selectedUnit.id)
        );
        finalRemark = finalRemark
          ? `${finalRemark} | Serial: ${serialNumber}`
          : `Serial: ${serialNumber}`;
      }

      if (nextStatus === "shipped" || nextStatus === "cancelled") {
        await tx.$executeRawUnsafe(
          `
            INSERT INTO order_update_logs
            (order_id, admin_id, event_type, from_order_status, to_order_status, courier_name, cn_number, cn_date, remark)
            VALUES (?, ?, 'order_status', ?, ?, ?, ?, ?, ?)
          `,
          current.orderId.toString(),
          adminId ? adminId.toString() : null,
          String(current.order?.orderStatus || ""),
          nextStatus,
          nextStatus === "shipped" ? courierName || null : null,
          nextStatus === "shipped" ? cnNumber || null : null,
          nextStatus === "shipped" && cnDate ? cnDate.toISOString().slice(0, 10) : null,
          finalRemark || null
        );
      }

      return changed;
      }
    );

    if (
      current?.user?.email &&
      String(currentStatus) !== String(nextStatus)
    ) {
      try {
        const mail = buildReturnStatusEmail({
          orderNumber: current.order?.orderNumber || current.orderId.toString(),
          customerName: current.user?.fullName,
          status: nextStatus,
          reason: current.reason,
          productName: current.product?.name || current.productCode,
        });
        await sendMail({
          to: current.user.email,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        });
      } catch (mailError) {
        console.error("RETURN_EMAIL_ERROR", mailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Return request updated",
      data: serializeBigInt(updated),
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

    if (error instanceof Error) {
      if (error.message === "SERIAL_NOT_FOUND") {
        return NextResponse.json(
          { success: false, message: "Selected serial number not found" },
          { status: 400 }
        );
      }
      if (error.message === "SERIAL_NOT_AVAILABLE") {
        return NextResponse.json(
          { success: false, message: "Selected serial number is not in stock" },
          { status: 400 }
        );
      }
      if (error.message === "SERIAL_NOT_MATCH_PRODUCT") {
        return NextResponse.json(
          { success: false, message: "Selected serial number does not match return product" },
          { status: 400 }
        );
      }
    }

    console.error("ADMIN_RETURN_UPDATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update return request" },
      { status: 500 }
    );
  }
}
