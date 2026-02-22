export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
// import { requireAdminRole } from "@/lib/auth"; 
import fs from "fs";
import path from "path";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { getCategoryImageDir, urlToFilePath } from "@/utils/imageUpload";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const statusParam = searchParams.get("status");
    const parentId = searchParams.get("parentId");

    const status = statusParam ? Number(statusParam) : 1;

    const categories = await prisma.category.findMany({
      where: {
        ...(status !== undefined && { status }),
        ...(parentId && { parentId: BigInt(parentId) }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        categories: serializeBigInt(categories),
      },
    });
  } catch (error) {
    console.error("CATEGORY_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  let imagePath: string | null = null;
  let createdCategory: any | null = null;

  try {
    // if (process.env.NODE_ENV === "production") {
    //   await requireAdminRole("ADMIN");
    // }

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const status = formData.get("status") as string;
    const description = formData.get("description") as string | null;
    const slug = formData.get("slug") as string | null;
    const parentId = formData.get("parentId") as string | null;
    const top = formData.get("top") as string | null;
    const file = formData.get("image") as File | null;
    const createdAt = new Date();

    if (!name || !status) {
      return NextResponse.json(
        { success: false, message: "Name and status are required" },
        { status: 400 }
      );
    }

    const uploadDir = getCategoryImageDir();
    console.log("upload dir:", uploadDir);

    fs.mkdirSync(uploadDir, { recursive: true });

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "")}`;
      const fullPath = path.join(uploadDir, fileName);

      fs.writeFileSync(fullPath, buffer);

      imagePath = `/uploads/categories/${fileName}`;
    }

    // ❌ BUG FIX: you had `category,` instead of `name`
    createdCategory = await prisma.category.create({
      data: {
        category: name, 
        description,
        // slug,
        createdAt,
        status: Number(status),
        parentId: parentId ? BigInt(parentId) : null,
        top: top ? Number(top) : 0,
        image: imagePath,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: serializeBigInt(createdCategory),
    });
  } catch (error) {
    // 🧹 Cleanup uploaded file if DB failed
    if (imagePath) {
      const filePath = urlToFilePath(imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 🧹 Cleanup DB if partially created
    if (createdCategory) {
      await prisma.category.delete({
        where: { id: createdCategory.id },
      });
    }

    console.error("CATEGORY_POST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Category creation failed" },
      { status: 500 }
    );
  }
}
