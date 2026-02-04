export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import fs from "fs";
import path from "path";
import { GET_UPLOAD_BASE_DIR, UPLOAD_BASE_DIR } from "@/utils/imageUpload";
// import { requireAdminRole } from "@/lib/auth"; // enable later

/**
 * GET /api/banners
 */
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: { banners },
    });
  } catch (error) {
    console.error("BANNER_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/banners
 */
export async function POST(req: Request) {
  let imagePath: string | null = null;
  let banner: any | null = null;

  try {
    // requireAdminRole("ADMIN"); // enable later

    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const position = formData.get("position") as string | null;
    const isActive = formData.get("isActive") as string | null;
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Banner image is required" },
        { status: 400 }
      );
    }

    /* ---------- IMAGE UPLOAD ---------- */
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // const uploadDir = path.join(
    //   process.cwd(),
    //   "public/uploads/banners"
    // );
    const uploadDir = path.join(
      UPLOAD_BASE_DIR,
      "banners"
    );

   

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "")}`;
    const fullPath = path.join(uploadDir, fileName);

    fs.writeFileSync(fullPath, buffer);

    imagePath = `/uploads/banners/${fileName}`;

    /* ---------- DB CREATE ---------- */
    banner = await prisma.banner.create({
      data: {
        title,
        imageUrl: imagePath,
        position: position ? Number(position) : 0,
        isActive: isActive ? Boolean(Number(isActive)) : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    /* ---------- CLEANUP ---------- */
    if (imagePath) {
      const filePath = path.join(GET_UPLOAD_BASE_DIR, imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (banner) {
      await prisma.banner.delete({
        where: { id: banner.id },
      });
    }

    console.error("BANNER_POST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Banner creation failed" },
      { status: 500 }
    );
  }
}
