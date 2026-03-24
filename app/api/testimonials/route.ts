export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";
import fs from "fs";
import path from "path";
import { UPLOAD_BASE_DIR, urlToFilePath } from "@/utils/imageUpload";

function normalizeBool(value: unknown, fallback = true) {
  if (typeof value === "boolean") return value;
  const str = String(value ?? "").toLowerCase().trim();
  if (str === "1" || str === "true") return true;
  if (str === "0" || str === "false") return false;
  return fallback;
}

async function ensureTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id BIGINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(191) NOT NULL,
      destination VARCHAR(191) NULL,
      address VARCHAR(191) NULL,
      profile_image VARCHAR(500) NULL,
      message TEXT NOT NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX idx_testimonials_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

function getTestimonialsDir() {
  return path.join(UPLOAD_BASE_DIR, "testimonials");
}

async function saveImageFromFile(file: File) {
  const uploadDir = getTestimonialsDir();
  fs.mkdirSync(uploadDir, { recursive: true });
  const cleanName = file.name.replace(/\s+/g, "");
  const fileName = `${Date.now()}-${cleanName}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
  return `/uploads/testimonials/${fileName}`;
}

export async function GET(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "1";
    const where = activeOnly ? "WHERE is_active = 1" : "";
    const rows = (await prisma.$queryRawUnsafe(`
      SELECT
        id,
        name,
        destination,
        address,
        profile_image,
        message,
        is_active as isActive,
        created_at as createdAt,
        updated_at as updatedAt
      FROM testimonials
      ${where}
      ORDER BY id DESC
    `)) as any[];
    return NextResponse.json(serializeBigInt(rows || []));
  } catch (error) {
    console.error("TESTIMONIALS_GET_ERROR", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdminRole();
    await ensureTable();

    const contentType = req.headers.get("content-type") || "";
    let name = "";
    let destination = "";
    let address = "";
    let message = "";
    let isActive = true;
    let profileImageUrl: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = String(formData.get("name") || "").trim();
      destination = String(formData.get("destination") || "").trim();
      address = String(formData.get("address") || "").trim();
      message = String(formData.get("message") || "").trim();
      isActive = normalizeBool(formData.get("isActive"), true);

      const fileRaw = formData.get("profileImage");
      const file = fileRaw instanceof File && fileRaw.size > 0 ? fileRaw : null;
      const profileImageText = String(formData.get("profile_image") || "").trim();

      if (file) {
        profileImageUrl = await saveImageFromFile(file);
      } else if (profileImageText) {
        profileImageUrl = profileImageText;
      }
    } else {
      const body = await req.json();
      name = String(body?.name || "").trim();
      destination = String(body?.destination || "").trim();
      address = String(body?.address || "").trim();
      message = String(body?.message || "").trim();
      isActive = normalizeBool(body?.isActive ?? body?.is_active, true);
      profileImageUrl = String(body?.profile_image || "").trim() || null;
    }

    if (!name || !message) {
      return NextResponse.json(
        { success: false, message: "Name and message are required" },
        { status: 400 }
      );
    }

    await prisma.$executeRawUnsafe(
      `
        INSERT INTO testimonials
        (name, destination, address, profile_image, message, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      name,
      destination || null,
      address || null,
      profileImageUrl,
      message,
      isActive ? 1 : 0
    );

    return NextResponse.json({
      success: true,
      message: "Testimonial created",
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
    console.error("TESTIMONIALS_POST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdminRole();
    await ensureTable();

    const contentType = req.headers.get("content-type") || "";
    let id = 0;
    let name = "";
    let destination = "";
    let address = "";
    let message = "";
    let isActive = true;
    let existingImage = "";
    let nextImageUrl: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      id = Number(formData.get("id") || 0);
      name = String(formData.get("name") || "").trim();
      destination = String(formData.get("destination") || "").trim();
      address = String(formData.get("address") || "").trim();
      message = String(formData.get("message") || "").trim();
      isActive = normalizeBool(formData.get("isActive"), true);
      existingImage = String(formData.get("existingImage") || "").trim();

      const fileRaw = formData.get("profileImage");
      const file = fileRaw instanceof File && fileRaw.size > 0 ? fileRaw : null;
      if (file) {
        if (existingImage && existingImage.startsWith("/uploads/")) {
          const oldPath = urlToFilePath(existingImage);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        nextImageUrl = await saveImageFromFile(file);
      } else {
        nextImageUrl = existingImage || null;
      }
    } else {
      const body = await req.json();
      id = Number(body?.id || 0);
      name = String(body?.name || "").trim();
      destination = String(body?.destination || "").trim();
      address = String(body?.address || "").trim();
      message = String(body?.message || "").trim();
      isActive = normalizeBool(body?.isActive ?? body?.is_active, true);
      nextImageUrl = String(body?.profile_image || "").trim() || null;
    }

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid id" },
        { status: 400 }
      );
    }
    if (!name || !message) {
      return NextResponse.json(
        { success: false, message: "Name and message are required" },
        { status: 400 }
      );
    }

    await prisma.$executeRawUnsafe(
      `
        UPDATE testimonials
        SET name = ?, destination = ?, address = ?, profile_image = ?, message = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP(3)
        WHERE id = ?
      `,
      name,
      destination || null,
      address || null,
      nextImageUrl,
      message,
      isActive ? 1 : 0,
      id
    );

    return NextResponse.json({
      success: true,
      message: "Testimonial updated",
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
    console.error("TESTIMONIALS_PUT_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdminRole();
    await ensureTable();

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id") || 0);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid id" },
        { status: 400 }
      );
    }

    const rows = (await prisma.$queryRawUnsafe(
      "SELECT profile_image as profileImage FROM testimonials WHERE id = ? LIMIT 1",
      id
    )) as any[];
    const profileImage = rows?.[0]?.profileImage || "";
    if (profileImage && String(profileImage).startsWith("/uploads/")) {
      const filePath = urlToFilePath(profileImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.$executeRawUnsafe("DELETE FROM testimonials WHERE id = ?", id);
    return NextResponse.json({ success: true, message: "Deleted" });
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
    console.error("TESTIMONIALS_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
