export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import fs from "fs";
import path from "path";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid popup ad id" },
        { status: 400 }
      );
    }

    const popupAdId = Number(id);

    if (isNaN(popupAdId)) {
      return NextResponse.json(
        { success: false, message: "Invalid popup ad id" },
        { status: 400 }
      );
    }

    const popupAd = await prisma.popupAds.findUnique({
      where: { id: popupAdId },
    });

    if (!popupAd) {
      return NextResponse.json(
        { success: false, message: "Popup ad not found" },
        { status: 404 }
      );
    }

    /* ---------- DELETE IMAGE ---------- */
    if (popupAd.imageUrl) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        popupAd.imageUrl
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    /* ---------- DELETE DB ---------- */
    await prisma.popupAds.delete({
      where: { id: popupAdId },
    });

    return NextResponse.json({
      success: true,
      message: "Popup ad deleted successfully",
    });
  } catch (error) {
    console.error("POPUPADS_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete popup ad" },
      { status: 500 }
    );
  }
}
