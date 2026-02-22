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

export async function GET() {
  try {
    const user = await requireAuth();
    const customerId = BigInt(user.sub);

    const addresses = await prisma.customerAddress.findMany({
      where: { customerId },
      include: {
        province: true,
        city: true,
        zone: true,
      },
      orderBy: [{ defaultShipping: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      data: serializeBigInt(addresses),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const customerId = BigInt(user.sub);
    const body = await req.json();

    const {
      fullName,
      phone,
      provinceId,
      cityId,
      zoneId,
      zoneName,
      address,
      landmark,
      addressType,
      defaultShipping,
      defaultBilling,
    } = body;

    if (
      !fullName ||
      !phone ||
      !provinceId ||
      !cityId ||
      !(zoneId || zoneName) ||
      !address
    ) {
      return NextResponse.json(
        { success: false, message: "Required address fields are missing" },
        { status: 400 }
      );
    }

    const created = await prisma.$transaction(async (tx) => {
      if (defaultShipping) {
        await tx.customerAddress.updateMany({
          where: { customerId },
          data: { defaultShipping: false },
        });
      }

      if (defaultBilling) {
        await tx.customerAddress.updateMany({
          where: { customerId },
          data: { defaultBilling: false },
        });
      }

      let resolvedZoneId = zoneId ? BigInt(zoneId) : null;
      if (!resolvedZoneId && zoneName) {
        const safeZoneName = String(zoneName).trim();
        const existingZone = await tx.addressZone.findFirst({
          where: { cityId: BigInt(cityId), zoneName: safeZoneName },
        });

        if (existingZone) {
          resolvedZoneId = existingZone.id;
        } else {
          const createdZone = await tx.addressZone.create({
            data: { cityId: BigInt(cityId), zoneName: safeZoneName },
          });
          resolvedZoneId = createdZone.id;
        }
      }

      if (!resolvedZoneId) {
        throw new Error("Zone is required");
      }

      return tx.customerAddress.create({
        data: {
          customerId,
          fullName,
          phone,
          provinceId: BigInt(provinceId),
          cityId: BigInt(cityId),
          zoneId: resolvedZoneId,
          address,
          landmark: landmark || null,
          addressType: toAddressType(addressType),
          defaultShipping: Boolean(defaultShipping),
          defaultBilling: Boolean(defaultBilling),
        },
        include: {
          province: true,
          city: true,
          zone: true,
        },
      });
    });

    return NextResponse.json(
      { success: true, data: serializeBigInt(created) },
      { status: 201 }
    );
  } catch (error) {
    console.error("CUSTOMER_ADDRESS_CREATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to save address" },
      { status: 500 }
    );
  }
}
