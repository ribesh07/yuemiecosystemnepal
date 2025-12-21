export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { randomCode } from "@/lib/randomCode";
import fs from "fs";
import path from "path";
import crypto from "crypto";


export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const slug = formData.get("slug")?.toString() || null;
    const description = formData.get("description")?.toString() || null;
    const specifications = formData.get("specifications")?.toString() || null;
    const packaging = formData.get("packaging")?.toString() || null;
    const warranty = formData.get("warranty")?.toString() || null;
    const categoryId = formData.get("categoryId")?.toString() || null;
    const brandId = formData.get("brandId")?.toString() || null;
    const actualPrice = formData.get("actualPrice")?.toString();
    const sellPrice = formData.get("sellPrice")?.toString();
    const discount = formData.get("discount")?.toString() || "0";
    const stockQuantity = formData.get("stockQuantity")?.toString();
    const availableQuantity = formData.get("availableQuantity")?.toString();
    const status = formData.get("status")?.toString();

    if (!name || !actualPrice || !sellPrice || !status) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const mainImageRaw = formData.get("mainImage");
    const mainImage =
      mainImageRaw instanceof File && mainImageRaw.size > 0
        ? mainImageRaw
        : null;

    const galleryImages = formData
      .getAll("images")
      .filter(
        (f): f is File =>
          f instanceof File && f.size > 0 && f.type.startsWith("image/")
      );

    const productCode = randomCode();
    const uploadDir = path.join(
      process.cwd(),
      "public/uploads",
      productCode,
      "images"
    );
    fs.mkdirSync(uploadDir, { recursive: true });

    let mainImagePath: string | null = null;
    const imagePaths: string[] = [];

    if (mainImage) {
      const ext = path.extname(mainImage.name);
      const fileName = `main-${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(
        filePath,
        Buffer.from(await mainImage.arrayBuffer())
      );

      mainImagePath = `/uploads/${productCode}/images/${fileName}`;
    }

    for (const file of galleryImages) {
      const ext = path.extname(file.name);
      const fileName = `${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(
        filePath,
        Buffer.from(await file.arrayBuffer())
      );

      imagePaths.push(`/uploads/${productCode}/images/${fileName}`);
    }

    const product = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          productCode,
          name,
          slug,
          description,
          specifications,
          packaging,
          warranty,
          categoryId: categoryId ? BigInt(categoryId) : null,
          brandId: brandId ? Number(brandId) : null,
          actualPrice,
          sellPrice,
          discount,
          stockQuantity: stockQuantity ? BigInt(stockQuantity) : BigInt(0),
          availableQuantity: availableQuantity
            ? BigInt(availableQuantity)
            : BigInt(0),
          status: Number(status),
        },
      });

      await tx.productImage.create({
        data: {
          productCode,
          mainImage: mainImagePath,
          imagePath: imagePaths,
        },
      });

      return createdProduct;
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: serializeBigInt(product),
    });
  } catch (error) {
    console.error("PRODUCT_CREATE_WITH_IMAGES_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json({
    success: true,
    products: serializeBigInt(products),
  });
}
