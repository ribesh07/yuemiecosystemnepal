export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid category id" },
        { status: 400 }
      );
    }

    const categoryId = BigInt(id);
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {category :serializeBigInt(category) } });
  } catch (error) {
    console.error("CATEGORY_SINGLE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch category" },
      { status: 500 }
    );
  }
}


import fs from "fs";
import path from "path";
import { serializeBigInt } from "@/lib/serializeBigInt";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid category id" },
        { status: 400 }
      );
    }

    const categoryId = BigInt(id);

    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const status = formData.get("status") as string | null;
    const parentId = formData.get("parentId") as string | null;
    const top = formData.get("top") as string | null;
    const file = formData.get("image") as File | null;

    let imagePath = existing.image;

    // 🔄 Replace image if provided
    if (file) {
      if (existing.image) {
        const oldPath = path.join(process.cwd(), "public", existing.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadDir = path.join(process.cwd(), "public/uploads/categories");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "")}`;
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);

      imagePath = `/uploads/categories/${fileName}`;
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(name && { name }),
        ...(status && { status: Number(status) }),
        ...(top && { top: Number(top) }),
        parentId: parentId ? BigInt(parentId) : null,
        image: imagePath,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: serializeBigInt(category),
    });
  } catch (error) {
    console.error("CATEGORY_UPDATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 }
    );
  }
}
