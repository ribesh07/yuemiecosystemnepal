export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import fs from "fs";
import path from "path";
// import { requireAdminRole } from "@/lib/auth";

/**
 * GET /api/popup-ads
 */
export async function GET() {
  try {
    const popupAds = await prisma.popupAds.findMany({
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: { popupAds },
    });
  } catch (error) {
    console.error("POPUPADS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch popup ads" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/popup-ads
 */
export async function POST(req: Request) {
  let imagePath: string | null = null;
  let popupAd: any | null = null;

  try {
    // requireAdminRole("ADMIN");

    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const colorCode = formData.get("colorCode") as string | null;
    const position = formData.get("position") as string | null;
    const isActive = formData.get("isActive") as string | null;
    const startAt = formData.get("startAt") as string | null;
    const endAt = formData.get("endAt") as string | null;
    const file = formData.get("image") as File | null;

    /* ---------- IMAGE UPLOAD ---------- */
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadDir = path.join(
        process.cwd(),
        "public/uploads/popup-ads"
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "")}`;
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);

      imagePath = `/uploads/popup-ads/${fileName}`;
    }

    /* ---------- DB CREATE ---------- */
    popupAd = await prisma.popupAds.create({
      data: {
        title,
        colorCode,
        imageUrl: imagePath,
        position: position ? Number(position) : 0,
        isActive: isActive ? Boolean(Number(isActive)) : true,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Popup ad created successfully",
      data: popupAd,
    });
  } catch (error) {
    /* ---------- CLEANUP ---------- */
    if (imagePath) {
      const filePath = path.join(process.cwd(), "public", imagePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    if (popupAd) {
      await prisma.popupAds.delete({
        where: { id: popupAd.id },
      });
    }

    console.error("POPUPADS_POST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Popup ad creation failed" },
      { status: 500 }
    );
  }
}
