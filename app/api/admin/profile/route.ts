import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

function getAdminId(sub: string | number | undefined) {
  const value = Number(sub);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export async function GET() {
  try {
    const auth = await requireAdminRole();
    const adminId = getAdminId(auth?.sub as string);

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "Invalid admin token" },
        { status: 401 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeBigInt(admin),
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

    console.error("ADMIN_PROFILE_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAdminRole();
    const adminId = getAdminId(auth?.sub as string);

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "Invalid admin token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const address = body?.address ? String(body.address).trim() : null;
    const phone = body?.phone ? String(body.phone).trim() : null;
    const country = body?.country ? String(body.country).trim() : null;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.admin.update({
      where: { id: adminId },
      data: {
        name,
        email,
        address,
        phone,
        country,
        updatedAt: new Date(),
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated",
      data: serializeBigInt(updated),
    });
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    if (error?.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    console.error("ADMIN_PROFILE_UPDATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
