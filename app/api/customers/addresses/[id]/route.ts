import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAuth } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

function toAddressType(value?: string) {
  if (!value) return "HOME" as const;
  const normalized = value.toUpperCase();
  if (normalized === "OFFICE") return "OFFICE" as const;
  if (normalized === "OTHERS") return "OTHERS" as const;
  return "HOME" as const;
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const customerId = BigInt(user.sub);
    const { id } = await context.params;
    const addressId = BigInt(id);
    const body = await req.json();

    const existing = await prisma.customerAddress.findFirst({
      where: { id: addressId, customerId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (body.defaultShipping) {
        await tx.customerAddress.updateMany({
          where: { customerId, id: { not: addressId } },
          data: { defaultShipping: false },
        });
      }

      if (body.defaultBilling) {
        await tx.customerAddress.updateMany({
          where: { customerId, id: { not: addressId } },
          data: { defaultBilling: false },
        });
      }

      let resolvedZoneId =
        body.zoneId !== undefined ? BigInt(body.zoneId) : undefined;

      if (
        resolvedZoneId === undefined &&
        body.zoneName !== undefined &&
        body.cityId !== undefined
      ) {
        const safeZoneName = String(body.zoneName).trim();
        if (!safeZoneName) {
          throw new Error("Zone is required");
        }

        const cityId = BigInt(body.cityId);
        const existingZone = await tx.addressZone.findFirst({
          where: { cityId, zoneName: safeZoneName },
        });

        if (existingZone) {
          resolvedZoneId = existingZone.id;
        } else {
          const createdZone = await tx.addressZone.create({
            data: { cityId, zoneName: safeZoneName },
          });
          resolvedZoneId = createdZone.id;
        }
      }

      return tx.customerAddress.update({
        where: { id: addressId },
        data: {
          ...(body.fullName !== undefined && { fullName: body.fullName }),
          ...(body.phone !== undefined && { phone: body.phone }),
          ...(body.provinceId !== undefined && {
            provinceId: BigInt(body.provinceId),
          }),
          ...(body.cityId !== undefined && { cityId: BigInt(body.cityId) }),
          ...(resolvedZoneId !== undefined && { zoneId: resolvedZoneId }),
          ...(body.address !== undefined && { address: body.address }),
          ...(body.landmark !== undefined && { landmark: body.landmark || null }),
          ...(body.addressType !== undefined && {
            addressType: toAddressType(body.addressType),
          }),
          ...(body.defaultShipping !== undefined && {
            defaultShipping: Boolean(body.defaultShipping),
          }),
          ...(body.defaultBilling !== undefined && {
            defaultBilling: Boolean(body.defaultBilling),
          }),
        },
        include: {
          province: true,
          city: true,
          zone: true,
        },
      });
    });

    return NextResponse.json({ success: true, data: serializeBigInt(updated) });
  } catch (error) {
    console.error("CUSTOMER_ADDRESS_UPDATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const customerId = BigInt(user.sub);
    const { id } = await context.params;
    const addressId = BigInt(id);

    const existing = await prisma.customerAddress.findFirst({
      where: { id: addressId, customerId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    await prisma.customerAddress.delete({
      where: { id: addressId },
    });

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("CUSTOMER_ADDRESS_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete address" },
      { status: 500 }
    );
  }
}
