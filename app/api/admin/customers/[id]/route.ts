import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

function parseBigInt(value: string) {
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminRole();

    const { id } = await context.params;
    const customerId = parseBigInt(id);

    if (!customerId) {
      return NextResponse.json(
        { success: false, message: "Invalid customer id" },
        { status: 400 }
      );
    }

    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        userId: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        status: true,
        orderCount: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          include: {
            province: true,
            city: true,
            zone: true,
          },
          orderBy: [{ defaultShipping: "desc" }, { createdAt: "desc" }],
        },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            subtotal: true,
            shippingCost: true,
            totalAmount: true,
            orderStatus: true,
            paymentStatus: true,
            createdAt: true,
            items: {
              select: {
                id: true,
                productCode: true,
                quantity: true,
                price: true,
                subtotal: true,
                product: {
                  select: {
                    name: true,
                    mainImage: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeBigInt(customer),
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

    console.error("ADMIN_CUSTOMER_DETAIL_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch customer detail" },
      { status: 500 }
    );
  }
}
