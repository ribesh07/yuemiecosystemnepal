import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { sendMail } from "@/lib/mailer";
import { buildOrderPaymentEmail, buildOrderStatusEmail } from "@/lib/orderEmail";

const ORDER_STATUS_FLOW: Record<string, string[]> = {
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: ["returns"],
  cancelled: [],
  returns: ["shipped", "cancelled"],
};

const PAYMENT_STATUSES = new Set(["unpaid", "paid", "partial", "refunded"]);

function parseOrderId(id: string) {
  try {
    return BigInt(id);
  } catch {
    return null;
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminRole();

    const { id } = await context.params;
    const orderId = parseOrderId(id);

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Invalid order id" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                productCode: true,
                mainImage: true,
              },
            },
          },
        },
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const serialRows = (await prisma.$queryRawUnsafe(
      `
        SELECT oi.id as orderItemId, pu.serial_number as serialNumber
        FROM order_items oi
        LEFT JOIN product_units pu ON pu.id = oi.product_unit_id
        WHERE oi.orderId = ?
      `,
      orderId.toString()
    )) as any[];

    const serialMap = new Map<string, string>();
    for (const row of serialRows || []) {
      serialMap.set(String(row.orderItemId), row.serialNumber || "");
    }

    const logs = (await prisma.$queryRawUnsafe(
      `
        SELECT
          id,
          order_id as orderId,
          admin_id as adminId,
          event_type as eventType,
          from_order_status as fromOrderStatus,
          to_order_status as toOrderStatus,
          from_payment_status as fromPaymentStatus,
          to_payment_status as toPaymentStatus,
          courier_name as courierName,
          cancel_reason as cancelReason,
          payment_mode as paymentMode,
          transaction_id as transactionId,
          cn_number as cnNumber,
          cn_date as cnDate,
          remark,
          created_at as createdAt
        FROM order_update_logs
        WHERE order_id = ?
        ORDER BY created_at DESC, id DESC
      `,
      orderId.toString()
    )) as any[];

    const payload = {
      ...order,
      items: (order.items || []).map((item: any) => ({
        ...item,
        serialNumber: serialMap.get(String(item.id)) || null,
      })),
      updateLogs: logs || [],
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
    console.error("ADMIN_ORDER_DETAIL_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminRole();

    const { id } = await context.params;
    const orderId = parseOrderId(id);

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Invalid order id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const nextOrderStatus = body?.orderStatus
      ? String(body.orderStatus).toLowerCase().trim()
      : null;
    const nextPaymentStatus = body?.paymentStatus
      ? String(body.paymentStatus).toLowerCase().trim()
      : null;
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
    const cancelReason = body?.cancelReason
      ? String(body.cancelReason).trim()
      : "";
    const remark = body?.remark
      ? String(body.remark).trim()
      : "";
    const paymentMode = body?.paymentMode
      ? String(body.paymentMode).trim()
      : "";
    const transactionId = body?.transactionId
      ? String(body.transactionId).trim()
      : "";

    if (!nextOrderStatus && !nextPaymentStatus) {
      return NextResponse.json(
        { success: false, message: "Nothing to update" },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payments: true,
        user: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (nextOrderStatus) {
      const current = String(existingOrder.orderStatus || "").toLowerCase();
      const allowedTransitions = ORDER_STATUS_FLOW[current] || [];

      if (
        current !== nextOrderStatus &&
        !allowedTransitions.includes(nextOrderStatus)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid status transition: ${current} -> ${nextOrderStatus}`,
          },
          { status: 400 }
        );
      }
    }

    if (nextPaymentStatus && !PAYMENT_STATUSES.has(nextPaymentStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment status" },
        { status: 400 }
      );
    }

    if (nextOrderStatus === "shipped" && !courierName) {
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

    if (nextOrderStatus === "cancelled" && !cancelReason) {
      return NextResponse.json(
        { success: false, message: "Cancellation reason is required" },
        { status: 400 }
      );
    }

    if (nextPaymentStatus === "paid" || nextPaymentStatus === "refunded") {
      if (!paymentMode) {
        return NextResponse.json(
          { success: false, message: "Payment mode is required" },
          { status: 400 }
        );
      }
      if (paymentMode.toUpperCase() !== "COD" && !transactionId) {
        return NextResponse.json(
          { success: false, message: "Transaction number is required" },
          { status: 400 }
        );
      }
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
    await prisma.$executeRawUnsafe(`
      ALTER TABLE order_update_logs
      ADD COLUMN IF NOT EXISTS cn_number VARCHAR(191) NULL AFTER transaction_id,
      ADD COLUMN IF NOT EXISTS cn_date DATE NULL AFTER cn_number;
    `);

    const adminId = admin?.sub ? BigInt(admin.sub) : null;

    const updated: any = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
      const txAny = tx as any;
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          ...(nextOrderStatus ? { orderStatus: nextOrderStatus } : {}),
          ...(nextPaymentStatus ? { paymentStatus: nextPaymentStatus } : {}),
          ...((nextPaymentStatus === "paid" || nextPaymentStatus === "refunded") && transactionId
            ? { transactionId }
            : {}),
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  productCode: true,
                  mainImage: true,
                },
              },
            },
          },
          payments: true,
        } as any,
      });

      if (nextPaymentStatus && existingOrder.payments.length) {
        await tx.orderPayment.updateMany({
          where: { orderId },
          data: {
            status: nextPaymentStatus,
            ...(paymentMode ? { paymentMode } : {}),
            ...(transactionId ? { transactionId } : {}),
            updatedAt: new Date(),
          },
        });
      } else if (nextPaymentStatus && !existingOrder.payments.length) {
        await tx.orderPayment.create({
          data: {
            orderId,
            paymentMode: paymentMode || null,
            transactionId: transactionId || null,
            paidAmount: nextPaymentStatus === "paid" ? order.totalAmount : 0,
            dueAmount: nextPaymentStatus === "paid" ? 0 : order.totalAmount,
            status: nextPaymentStatus,
          },
        });
      }

      const currentStatus = String(existingOrder.orderStatus || "").toLowerCase();
      const unitRows = (await tx.$queryRawUnsafe(
        "SELECT id, productCode, product_unit_id as productUnitId FROM order_items WHERE orderId = ?",
        orderId.toString()
      )) as any[];
      const unitIdByItemId = new Map<string, bigint | null>();
      for (const row of unitRows || []) {
        unitIdByItemId.set(String(row.id), row.productUnitId ? BigInt(row.productUnitId) : null);
      }

      if (nextOrderStatus && nextOrderStatus === "cancelled" && currentStatus !== "cancelled") {
        let unitIds = (order.items as any[])
          .map((item: any) => unitIdByItemId.get(String(item.id)))
          .filter((id: any): id is bigint => Boolean(id));
        if (!unitIds.length) {
          unitIds = (unitRows || [])
            .map((r: any) => r.productUnitId)
            .filter(Boolean)
            .map((id: any) => BigInt(id))
            .filter((id: any): id is bigint => typeof id === "bigint");
        }
        if (unitIds.length) {
          if (txAny.productUnit?.updateMany) {
            await txAny.productUnit.updateMany({
              where: { id: { in: unitIds } },
              data: { status: "in_stock" },
            });
          } else {
            for (const id of unitIds) {
              await tx.$executeRawUnsafe(
                "UPDATE product_units SET status = 'in_stock' WHERE id = ?",
                id.toString()
              );
            }
          }
        }
      }

      if (nextOrderStatus && nextOrderStatus === "delivered" && currentStatus !== "delivered") {
        let warrantyItems = (order.items as any[])
          .map((item: any) => ({
            productCode: item.productCode,
            productUnitId: unitIdByItemId.get(String(item.id)),
            customerId: order.customerId,
          }))
          .filter((item: any) => item.productUnitId);

        if (!warrantyItems.length) {
          warrantyItems = (unitRows || []).map((row: any) => ({
            productCode: row.productCode,
            productUnitId: row.productUnitId ? BigInt(row.productUnitId) : null,
            customerId: order.customerId,
          })).filter((item: any) => item.productUnitId);
        }

        for (const item of warrantyItems) {
          if (!item.productUnitId) continue;
          const existingWarranty = txAny.warranty?.findUnique
            ? await txAny.warranty.findUnique({
                where: { productUnitId: item.productUnitId },
              })
            : (
                (await tx.$queryRawUnsafe(
                  "SELECT id FROM warranties WHERE product_unit_id = ? LIMIT 1",
                  item.productUnitId.toString()
                )) as any[]
              )?.[0] || null;
          if (existingWarranty) continue;

          const wdRows = (await tx.$queryRawUnsafe(
            "SELECT warranty_days as warrantyDays FROM products WHERE product_code = ? LIMIT 1",
            item.productCode
          )) as any[];
          const days = Number(wdRows?.[0]?.warrantyDays || 365);
          const purchaseDate = new Date();
          const expiryDate = new Date(purchaseDate);
          expiryDate.setDate(expiryDate.getDate() + days);

          if (txAny.warranty?.create) {
            await txAny.warranty.create({
              data: {
                productUnitId: item.productUnitId as bigint,
                orderId,
                customerId: order.customerId,
                purchaseDate,
                expiryDate,
                purchaseSource: "online",
              },
            });
          } else {
            await tx.$executeRawUnsafe(
              `
                INSERT INTO warranties
                (product_unit_id, order_id, customer_id, purchase_date, expiry_date, purchase_source)
                VALUES (?, ?, ?, ?, ?, 'online')
              `,
              item.productUnitId.toString(),
              orderId.toString(),
              order.customerId.toString(),
              purchaseDate,
              expiryDate
            );
          }
        }
      }

      if (nextOrderStatus) {
        await tx.$executeRawUnsafe(
          `
            INSERT INTO order_update_logs
            (order_id, admin_id, event_type, from_order_status, to_order_status, courier_name, cancel_reason, cn_number, cn_date, remark)
            VALUES (?, ?, 'order_status', ?, ?, ?, ?, ?, ?, ?)
          `,
          orderId.toString(),
          adminId ? adminId.toString() : null,
          String(existingOrder.orderStatus || ""),
          nextOrderStatus,
          courierName || null,
          cancelReason || null,
          cnNumber || null,
          cnDate ? cnDate.toISOString().slice(0, 10) : null,
          remark || null
        );
      }

      if (nextPaymentStatus) {
        await tx.$executeRawUnsafe(
          `
            INSERT INTO order_update_logs
            (order_id, admin_id, event_type, from_payment_status, to_payment_status, payment_mode, transaction_id, remark)
            VALUES (?, ?, 'payment_status', ?, ?, ?, ?, ?)
          `,
          orderId.toString(),
          adminId ? adminId.toString() : null,
          String(existingOrder.paymentStatus || ""),
          nextPaymentStatus,
          paymentMode || null,
          transactionId || null,
          remark || null
        );
      }

      return order;
      }
    );

    if (
      nextOrderStatus &&
      String(existingOrder.orderStatus || "").toLowerCase() !== nextOrderStatus &&
      updated.user?.email
    ) {
      try {
        const mail = buildOrderStatusEmail(updated);
        await sendMail({
          to: updated.user.email,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        });
      } catch (mailError) {
        console.error("ORDER_STATUS_EMAIL_ERROR", mailError);
      }
    }

    if (
      nextPaymentStatus &&
      String(existingOrder.paymentStatus || "").toLowerCase() !== nextPaymentStatus &&
      updated.user?.email
    ) {
      try {
        const mail = buildOrderPaymentEmail(updated);
        await sendMail({
          to: updated.user.email,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        });
      } catch (mailError) {
        console.error("ORDER_PAYMENT_EMAIL_ERROR", mailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order updated",
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

    console.error("ADMIN_ORDER_UPDATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}
