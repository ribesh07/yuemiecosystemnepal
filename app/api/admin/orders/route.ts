import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

function toPositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

const ALLOWED_ORDER_STATUSES = new Set([
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returns",
]);

export async function GET(req: Request) {
  try {
    await requireAdminRole();

    const { searchParams } = new URL(req.url);
    const page = toPositiveInt(searchParams.get("page"), 1);
    const limit = Math.min(toPositiveInt(searchParams.get("limit"), 20), 100);
    const status = (searchParams.get("status") || "all").toLowerCase();
    const search = (searchParams.get("search") || "").trim();

    const where: any = {};

    if (status !== "all") {
      if (!ALLOWED_ORDER_STATUSES.has(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid order status filter" },
          { status: 400 }
        );
      }
      where.orderStatus = status;
    }

    if (search) {
      where.OR = [
        {
          user: {
            fullName: { contains: search },
          },
        },
        {
          user: {
            email: { contains: search },
          },
        },
        {
          items: {
            some: {
              product: {
                name: { contains: search },
              },
            },
          },
        },
      ];

      if (/^\d+$/.test(search)) {
        where.OR.push({ orderNumber: BigInt(search) });
      }
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
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
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: serializeBigInt(orders),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
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

    console.error("ADMIN_ORDER_LIST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
