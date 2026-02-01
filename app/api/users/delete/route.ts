import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = BigInt(params.id);

    // 1️⃣ Check processing orders
    const processingOrderCount = await prisma.order.count({
      where: {
        customerId: userId,
        orderStatus: "processing",
      },
    });

    if (processingOrderCount > 0) {
      return NextResponse.json(
        {
          message:
            "User cannot be deleted. Processing orders still exist.",
        },
        { status: 400 }
      );
    }

    // 2️⃣ Delete user + related data safely
    await prisma.$transaction([
      prisma.cartItem.deleteMany({
        where: {
          cart: {
            customerId: userId,
          },
        },
      }),

      prisma.cart.deleteMany({
        where: { customerId: userId },
      }),

      prisma.wishlist.deleteMany({
        where: { customerId: userId },
      }),

      prisma.customerAddress.deleteMany({
        where: { customerId: userId },
      }),

      prisma.orderPayment.deleteMany({
        where: {
          order: {
            customerId: userId,
          },
        },
      }),

      prisma.orderItem.deleteMany({
        where: {
          order: {
            customerId: userId,
          },
        },
      }),

      prisma.order.deleteMany({
        where: { customerId: userId },
      }),

      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
