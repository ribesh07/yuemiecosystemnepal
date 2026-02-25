import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAuth } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

function parseBigInt(value: string) {
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    const customerId = BigInt(auth.sub);
    const { id } = await context.params;
    const orderId = parseBigInt(id);

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Invalid order id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const action = String(body?.action || "").toLowerCase();
    const reason = String(body?.reason || "").trim();

    if (!["cancel", "return"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId },
      include: {
        user: { select: { fullName: true, email: true } },
        items: { select: { productCode: true, quantity: true } },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const currentStatus = String(order.orderStatus || "").toLowerCase();

    if (action === "cancel") {
      if (!["processing", "shipped"].includes(currentStatus)) {
        return NextResponse.json(
          { success: false, message: "Only processing or shipped orders can be cancelled" },
          { status: 400 }
        );
      }

      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          orderStatus: "cancelled",
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Order cancelled successfully",
        data: serializeBigInt(updated),
      });
    }

    if (currentStatus !== "delivered") {
      return NextResponse.json(
        { success: false, message: "Only delivered orders can be returned" },
        { status: 400 }
      );
    }

    const deliveredAt = order.updatedAt || order.createdAt;
    if (!deliveredAt) {
      return NextResponse.json(
        { success: false, message: "Invalid delivered date for return request" },
        { status: 400 }
      );
    }
    const ageMs = Date.now() - new Date(deliveredAt).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    if (ageDays > 3) {
      return NextResponse.json(
        { success: false, message: "Return window is only 3 days after delivery" },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { success: false, message: "Return reason is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const existingActiveReturns = await (tx as any).returnRequest?.count({
        where: {
          orderId,
          customerId,
          status: { in: ["new", "shipped"] },
        },
      });

      if (existingActiveReturns > 0) {
        throw new Error("RETURN_ALREADY_REQUESTED");
      }

      const changed = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: "returns",
          updatedAt: new Date(),
        },
      });

      if (!(tx as any).returnRequest) {
        throw new Error("RETURN_MODEL_NOT_READY");
      }

      await (tx as any).returnRequest.createMany({
        data: order.items.map((item) => ({
          orderId,
          customerId,
          productCode: item.productCode,
          quantity: item.quantity,
          reason,
          status: "new",
        })),
      });

      return changed;
    });

    return NextResponse.json({
      success: true,
      message: "Return request submitted",
      data: serializeBigInt(updated),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "RETURN_ALREADY_REQUESTED") {
      return NextResponse.json(
        { success: false, message: "Return request already exists for this order" },
        { status: 409 }
      );
    }
    if (error instanceof Error && error.message === "RETURN_MODEL_NOT_READY") {
      return NextResponse.json(
        {
          success: false,
          message: "Return table is not ready. Run prisma migrate/generate and restart server.",
        },
        { status: 500 }
      );
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("ORDER_ACTION_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}
