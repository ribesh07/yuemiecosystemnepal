export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { UPLOAD_BASE_DIR, urlToFilePath } from "@/utils/imageUpload";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (process.env.NODE_ENV === "production") {
      await requireAdminRole("ADMIN");
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Banner id is required" },
        { status: 400 }
      );
    }

    const bannerId = Number(id);
    const banner = await prisma.banner.findUnique({ where: { id: bannerId } });

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const position = formData.get("position") as string | null;
    const isActive = formData.get("isActive") as string | null;
    const file = formData.get("image") as File | null;

    let imagePath = banner.imageUrl;

    if (file && file.size > 0) {
      if (banner.imageUrl) {
        const oldPath = urlToFilePath(banner.imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const uploadDir = path.join(UPLOAD_BASE_DIR, "banners");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "")}`;
      const fullPath = path.join(uploadDir, fileName);
      fs.writeFileSync(fullPath, Buffer.from(await file.arrayBuffer()));
      imagePath = `/uploads/banners/${fileName}`;
    }

    const updated = await prisma.banner.update({
      where: { id: bannerId },
      data: {
        title: title ?? banner.title,
        imageUrl: imagePath,
        position: position ? Number(position) : banner.position,
        isActive: isActive ? Boolean(Number(isActive)) : banner.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("BANNER_UPDATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (process.env.NODE_ENV === "production") {
      await requireAdminRole("ADMIN");
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Banner id is required" },
        { status: 400 }
      );
    }

    const bannerId = Number(id);
    const banner = await prisma.banner.findUnique({ where: { id: bannerId } });

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    if (banner.imageUrl) {
      const imagePath = urlToFilePath(banner.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.banner.delete({ where: { id: bannerId } });

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("BANNER_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
