import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAuth } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

export async function GET() {
  try {
    const user = await requireAuth();
    const customerId = BigInt(user.sub);

    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              select: {
                productCode: true,
                name: true,
                mainImage: true,
              },
            },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: serializeBigInt(orders),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("ORDER_LIST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to load orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const customerId = BigInt(user.sub);
    const body = await req.json();

    const productId = body?.productId ? BigInt(body.productId) : null;
    const addressId = body?.addressId ? BigInt(body.addressId) : null;
    const quantity = Number(body?.quantity || 0);
    const paymentMethod = String(body?.paymentMethod || "").toLowerCase();

    if (!productId || !addressId || !quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid order payload" },
        { status: 400 }
      );
    }

    if (paymentMethod !== "cod") {
      return NextResponse.json(
        { success: false, message: "Only COD is supported currently" },
        { status: 400 }
      );
    }

    const address = await prisma.customerAddress.findFirst({
      where: { id: addressId, customerId },
      include: { city: true },
    });

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const available = Number(product.availableQuantity || 0);
    if (quantity > available) {
      return NextResponse.json(
        { success: false, message: "Insufficient stock" },
        { status: 400 }
      );
    }

    const unitPrice = Number(product.sellPrice || 0);
    const subtotal = unitPrice * quantity;
    const shippingCost = Number(address.city?.shippingCost || 0);
    const discount = 0;
    const tax = 0;
    const totalAmount = subtotal + shippingCost + tax - discount;
    const orderNumber = BigInt(
      `${Date.now()}${Math.floor(100 + Math.random() * 900)}`
    );

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          subtotal: String(subtotal),
          tax: String(tax),
          shippingCost: String(shippingCost),
          discount: String(discount),
          totalAmount: String(totalAmount),
          orderStatus: "processing",
          paymentStatus: "unpaid",
        },
      });

      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productCode: product.productCode,
          quantity: BigInt(quantity),
          price: String(unitPrice),
          subtotal: String(subtotal),
        },
      });

      await tx.orderPayment.create({
        data: {
          orderId: order.id,
          paymentMode: "COD",
          paidAmount: "0",
          dueAmount: String(totalAmount),
          status: "unpaid",
        },
      });

      await tx.product.update({
        where: { id: product.id },
        data: {
          availableQuantity: BigInt(available - quantity),
        },
      });

      await tx.user.update({
        where: { id: customerId },
        data: {
          orderCount: { increment: 1 },
        },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      data: serializeBigInt(result),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("ORDER_CREATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order" },
      { status: 500 }
    );
  }
}
