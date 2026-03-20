export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { UPLOAD_BASE_DIR, urlToFilePath } from "@/utils/imageUpload";

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
    const userId = BigInt(user.sub);
    const contentType = req.headers.get("content-type") || "";

    let fullName: string | undefined;
    let profilePhotoPath: string | null | undefined;
    let profilePhotoFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      fullName = formData.get("fullName")?.toString();
      const rawPath = formData.get("profilePhotoPath");
      if (rawPath !== null) {
        const value = rawPath?.toString()?.trim();
        profilePhotoPath = value || null;
      }

      const rawFile = formData.get("profilePhoto");
      if (rawFile instanceof File && rawFile.size > 0) {
        profilePhotoFile = rawFile;
      }
    } else {
      const body = await req.json();
      fullName = body?.fullName;
      if (body?.profilePhotoPath !== undefined) {
        profilePhotoPath = body?.profilePhotoPath || null;
      }
    }

    if (!fullName || !String(fullName).trim()) {
      return NextResponse.json(
        { success: false, message: "Full name is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePhotoPath: true },
    });

    if (profilePhotoFile) {
      const uploadDir = path.join(
        UPLOAD_BASE_DIR,
        "users",
        String(user.sub),
        "profile"
      );
      fs.mkdirSync(uploadDir, { recursive: true });

      const ext = path.extname(profilePhotoFile.name) || ".jpg";
      const fileName = `profile-${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      const bytes = await profilePhotoFile.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(bytes));

      profilePhotoPath = `/uploads/users/${user.sub}/profile/${fileName}`;

      if (existing?.profilePhotoPath?.startsWith("/uploads/")) {
        const oldFilePath = urlToFilePath(existing.profilePhotoPath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
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
  } catch (error) {
    console.error("USER_PROFILE_UPDATE_ERROR", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
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
