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

export async function POST(
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
    const rating = Number(body?.rating || 0);
    const review = String(body?.review || "").trim();
    const productCode = String(body?.productCode || "").trim();

    if (!productCode || !review || !rating) {
      return NextResponse.json(
        { success: false, message: "Rating, review and product are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, customerId },
      include: {
        user: { select: { fullName: true, email: true } },
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (String(order.orderStatus).toLowerCase() !== "delivered") {
      return NextResponse.json(
        { success: false, message: "Review is allowed only for delivered orders" },
        { status: 400 }
      );
    }

    const hasProduct = order.items.some(
      (item: { productCode: string }) => String(item.productCode) === productCode
    );

    if (!hasProduct) {
      return NextResponse.json(
        { success: false, message: "Selected product not found in this order" },
        { status: 400 }
      );
    }

    const existingReview = await prisma.productReview.findFirst({
      where: {
        customerId,
        productCode,
        orderId: String(order.orderNumber),
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: "You already reviewed this product for this order" },
        { status: 409 }
      );
    }

    const created = await prisma.productReview.create({
      data: {
        customerId,
        productCode,
        orderId: String(order.orderNumber),
        name: order.user?.fullName || "Customer",
        email: order.user?.email || "",
        review,
        rating: String(rating),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        data: serializeBigInt(created),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("ORDER_REVIEW_CREATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit review" },
      { status: 500 }
    );
  }
}
