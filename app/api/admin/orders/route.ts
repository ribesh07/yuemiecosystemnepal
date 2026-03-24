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
    const dateFromRaw = (searchParams.get("dateFrom") || "").trim();
    const dateToRaw = (searchParams.get("dateTo") || "").trim();

    const baseWhere: any = {};

    if (dateFromRaw || dateToRaw) {
      const createdAt: any = {};
      if (dateFromRaw) {
        const fromDate = new Date(dateFromRaw);
        if (!Number.isNaN(fromDate.valueOf())) {
          createdAt.gte = fromDate;
        }
      }
      if (dateToRaw) {
        const toDate = new Date(dateToRaw);
        if (!Number.isNaN(toDate.valueOf())) {
          toDate.setHours(23, 59, 59, 999);
          createdAt.lte = toDate;
        }
      }
      if (Object.keys(createdAt).length > 0) {
        baseWhere.createdAt = createdAt;
      }
    }

    if (status !== "all") {
      if (!ALLOWED_ORDER_STATUSES.has(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid order status filter" },
          { status: 400 }
        );
      }
    }

    if (search) {
      baseWhere.OR = [
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
        baseWhere.OR.push({ orderNumber: BigInt(search) });
      }
    }

    const where: any =
      status === "all" ? { ...baseWhere } : { ...baseWhere, orderStatus: status };

    const [total, orders, allCount, processingCount, shippedCount, deliveredCount, cancelledCount, returnsCount] = await Promise.all([
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
      prisma.order.count({ where: { ...baseWhere } }),
      prisma.order.count({ where: { ...baseWhere, orderStatus: "processing" } }),
      prisma.order.count({ where: { ...baseWhere, orderStatus: "shipped" } }),
      prisma.order.count({ where: { ...baseWhere, orderStatus: "delivered" } }),
      prisma.order.count({ where: { ...baseWhere, orderStatus: "cancelled" } }),
      prisma.order.count({ where: { ...baseWhere, orderStatus: "returns" } }),
    ]);

    const orderIds = (orders || []).map((o: any) => o.id?.toString()).filter(Boolean);
    let serialRows: any[] = [];
    if (orderIds.length) {
      const placeholders = orderIds.map(() => "?").join(",");
      serialRows = (await prisma.$queryRawUnsafe(
        `
          SELECT oi.id as orderItemId, oi.orderId as orderId, oi.productCode as productCode,
                 pu.serial_number as serialNumber
          FROM order_items oi
          LEFT JOIN product_units pu ON pu.id = oi.product_unit_id
          WHERE oi.orderId IN (${placeholders})
        `,
        ...orderIds
      )) as any[];
    }

    const serialMap = new Map<string, string>();
    for (const row of serialRows) {
      serialMap.set(String(row.orderItemId), row.serialNumber || "");
    }

    const enrichedOrders = (orders as any[]).map((order) => ({
      ...order,
      items: (order.items || []).map((item: any) => ({
        ...item,
        serialNumber: serialMap.get(String(item.id)) || null,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: serializeBigInt(enrichedOrders),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        statusCounts: {
          all: allCount,
          processing: processingCount,
          shipped: shippedCount,
          delivered: deliveredCount,
          cancelled: cancelledCount,
          returns: returnsCount,
        },
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
