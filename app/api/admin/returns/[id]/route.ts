import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

function parseId(value: string) {
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
    await requireAdminRole();

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

    if (!nextStatus || !["new", "shipped", "cancelled"].includes(nextStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const current = await (prisma as any).returnRequest.findUnique({
      where: { id: returnId },
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

    const updated = await prisma.$transaction(async (tx) => {
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

      return changed;
    });

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

    console.error("ADMIN_RETURN_UPDATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update return request" },
      { status: 500 }
    );
  }
}
