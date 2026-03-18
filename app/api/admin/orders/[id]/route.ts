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

export async function PATCH(
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

    const body = await req.json();
    const nextOrderStatus = body?.orderStatus
      ? String(body.orderStatus).toLowerCase().trim()
      : null;
    const nextPaymentStatus = body?.paymentStatus
      ? String(body.paymentStatus).toLowerCase().trim()
      : null;

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

    const updated: any = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
      const txAny = tx as any;
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          ...(nextOrderStatus ? { orderStatus: nextOrderStatus } : {}),
          ...(nextPaymentStatus ? { paymentStatus: nextPaymentStatus } : {}),
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
              productUnit: {
                select: {
                  id: true,
                  serialNumber: true,
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
            updatedAt: new Date(),
          },
        });
      }

      const currentStatus = String(existingOrder.orderStatus || "").toLowerCase();

      if (nextOrderStatus && nextOrderStatus === "cancelled" && currentStatus !== "cancelled") {
        let unitIds = (order.items as any[])
          .map((item: any) => item.productUnit?.id)
          .filter((id: any) => id);
        if (!unitIds.length) {
          const unitRows = (await tx.$queryRawUnsafe(
            "SELECT product_unit_id as productUnitId FROM order_items WHERE orderId = ? AND product_unit_id IS NOT NULL",
            orderId.toString()
          )) as any[];
          unitIds = (unitRows || []).map((r: any) => r.productUnitId).filter(Boolean);
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
            productUnitId: item.productUnit?.id,
            customerId: order.customerId,
          }))
          .filter((item: any) => item.productUnitId);

        if (!warrantyItems.length) {
          const unitRows = (await tx.$queryRawUnsafe(
            "SELECT productCode, product_unit_id as productUnitId FROM order_items WHERE orderId = ? AND product_unit_id IS NOT NULL",
            orderId.toString()
          )) as any[];
          warrantyItems = (unitRows || []).map((row: any) => ({
            productCode: row.productCode,
            productUnitId: row.productUnitId,
            customerId: order.customerId,
          }));
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
                productUnitId: item.productUnitId,
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
