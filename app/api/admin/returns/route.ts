import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const rows = await (prisma as any).returnRequest.findMany({
      where: {
        ...(status && status !== "all" ? { status } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderStatus: true,
            paymentStatus: true,
          },
        },
        product: {
          select: {
            productCode: true,
            name: true,
            mainImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: serializeBigInt(rows) });
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

    console.error("ADMIN_RETURN_LIST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch return requests" },
      { status: 500 }
    );
  }
}
