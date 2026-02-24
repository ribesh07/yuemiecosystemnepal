import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";
const safeUserSelect = {
 id: true,
 userId: true,
 fullName: true,
 email: true,
 phone: true,
 gender: true,
 status: true,
 orderCount: true,
 profilePhotoPath: true,
 createdAt: true,
};

export async function GET() {
  try {
    const user = await requireAuth();

     const profile = await prisma.user.findUnique({
     where: { id: BigInt(user.sub) },
    select: {
      ...safeUserSelect,
      addresses: true,
    },  
  });  

    if (!profile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeBigInt(profile) });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }  
}  

export async function PUT(req: Request) {
  try {
    const user = await requireAuth();
    const { fullName, profilePhotoPath } = await req.json();

    if (!fullName || !String(fullName).trim()) {
      return NextResponse.json(
        { success: false, message: "Full name is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: BigInt(user.sub) },
      data: {
        fullName: String(fullName).trim(),
        ...(profilePhotoPath !== undefined && {
          profilePhotoPath: profilePhotoPath || null,
        }),
        updatedAt: new Date(),
      },
      select: safeUserSelect,
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: serializeBigInt(updated),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireAuth();
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All password fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "New password and confirm password must match" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { id: BigInt(user.sub) },
      select: { id: true, password: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const valid = await bcrypt.compare(currentPassword, existing.password);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: existing.id },
      data: { password: hashed, updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}

