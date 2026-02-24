import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

const ORDER_STATUS_FLOW: Record<string, string[]> = {
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: ["returns"],
  cancelled: [],
  returns: [],
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

    const updated = await prisma.$transaction(async (tx) => {
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
            },
          },
          payments: true,
        },
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

      return order;
    });

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
