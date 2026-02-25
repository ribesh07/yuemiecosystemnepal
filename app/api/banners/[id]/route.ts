export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import fs from "fs";
import { requireAdminRole } from "@/lib/auth";
import { urlToFilePath } from "@/utils/imageUpload";

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
        { success: false, message: "Invalid banner id" },
        { status: 400 }
      );
    }

    const bannerId = Number(id);

    if (isNaN(bannerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid banner id" },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.findUnique({
      where: { id: bannerId },
    });

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    /* ---------- DELETE IMAGE ---------- */
    if (banner.imageUrl) {
      const imagePath = urlToFilePath(banner.imageUrl);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    /* ---------- DELETE DB ---------- */
    await prisma.banner.delete({
      where: { id: bannerId },
    });

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
