export const runtime = "nodejs";


import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { serializeBigInt } from "@/lib/serializeBigInt";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // const status = searchParams.get("status");
    // const parentId = searchParams.get("parentId");
    const status = 1;

    const categories = await prisma.category.findMany({
      where: {
        ...(status && { status: Number(status) }),
        // ...(parentId && { parentId: BigInt(parentId) }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        categories : serializeBigInt(categories)},
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
      let category: any | null = null;
    try {
      //   requireAdminRole("ADMIN");     //later use enable

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const status = formData.get("status") as string;
    const parentId = formData.get("parentId") as string | null;
    const top = formData.get("top") as string | null;
    const file = formData.get("image") as File | null;

    if (!name || !status) {
      return NextResponse.json(
        { success: false, message: "Name and status are required" },
        { status: 400 }
      );
    }

  

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads/categories");
      console.log("upload dir: " , uploadDir);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "")}`;
      const fullPath = path.join(uploadDir, fileName);

      fs.writeFileSync(fullPath, buffer);

      imagePath = `/uploads/categories/${fileName}`;
    }

     category = await prisma.category.create({
        data: {
            category,
            status: Number(status),
            parentId: parentId ? BigInt(parentId) : null,
            top: top ? Number(top) : 0,
            image: imagePath,
        },
        });

    return NextResponse.json({
        success: true,
        message: "Category created successfully",
        data: serializeBigInt(category), 
        });
  } catch (error) {
     if (imagePath) {
    const filePath = path.join(process.cwd(), "public", imagePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  if(category){
    const cleanup = await prisma.category.delete({
        where : {
            id : category.id
        }
    })
  }

  console.error("CATEGORY_POST_ERROR", error);
  return NextResponse.json(
    { success: false, message: "Category creation failed" },
    { status: 500 }
  );
  }
}
