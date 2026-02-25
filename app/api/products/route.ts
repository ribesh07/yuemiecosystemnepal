export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { getProductImageDir } from "@/utils/imageUpload";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // --- Required product fields ---
    const name = formData.get("name")?.toString();
    const productCode = formData.get("productCode")?.toString();
    const slug = formData.get("slug")?.toString() || null;
    const description = formData.get("productDescription")?.toString() || null;
    const specifications = formData.get("keySpecifications")?.toString() || null;
    const packaging = formData.get("packaging")?.toString() || null;
    const warranty = formData.get("warranty")?.toString() || null;
    const categoryId = formData.get("categoryId")?.toString() || null;
    const categoryName = formData.get("categoryName")?.toString() || null;
    const actualPrice = formData.get("actualPrice")?.toString();
    const sellPrice = formData.get("sellingPrice")?.toString();
    const discount = formData.get("discount")?.toString() || "0";
    const stockQuantity = formData.get("stockQuantity")?.toString();
    const availableQuantity = formData.get("availableQuantity")?.toString();
    const status = formData.get("status")?.toString();
    const raw = formData.get("deliveryTargetDays")?.toString();
    const deliveryTargetDays = raw ? Number(raw) : null;
    const weeklyProduct = formData.get("weeklyProduct")?.toString();
    const flashSaleProduct = formData.get("flashSaleProduct")?.toString();
    const todayDeals = formData.get("todayDeals")?.toString();
    const specialProduct = formData.get("specialProduct")?.toString();

    if (!name || !productCode || !actualPrice || !sellPrice || !status) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    // --- Handle files ---
    const mainImageRaw = formData.get("mainImage");
    const mainImage =
      mainImageRaw instanceof File && mainImageRaw.size > 0
        ? mainImageRaw
        : null;

    const productCatalogRaw = formData.get("productCatalog");
    const productCatalog =
      productCatalogRaw instanceof File && productCatalogRaw.size > 0
        ? productCatalogRaw
        : null;

    const galleryImages = formData
      .getAll("productImages")
      .filter((f): f is File => f instanceof File && f.size > 0 && f.type.startsWith("image/"));

    // --- Ensure upload directory exists ---
    const uploadDir = getProductImageDir(productCode);
    fs.mkdirSync(uploadDir, { recursive: true });

    let mainImagePath: string | null = null;
    let productCatalogPath: string | null = null;
    const imagePaths: string[] = [];

    if (mainImage) {
      const ext = path.extname(mainImage.name);
      const fileName = `main-${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(await mainImage.arrayBuffer()));
      mainImagePath = `/uploads/products/${productCode}/images/${fileName}`;
    }

    if (productCatalog) {
      const ext = path.extname(productCatalog.name);
      const fileName = `catalog-${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(await productCatalog.arrayBuffer()));
      productCatalogPath = `/uploads/products/${productCode}/images/${fileName}`;
    }

    for (const file of galleryImages) {
      const ext = path.extname(file.name);
      const fileName = `${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
      imagePaths.push(`/uploads/products/${productCode}/images/${fileName}`);
    }

    // --- Ensure brand "Yuemi" exists and always use it ---
    // --- Ensure brand "Yuemi" exists and always use it ---
const yuemiBrand = await prisma.brand.upsert({
  where: { name: "Yuemi" },
  update: {},
  create: { name: "Yuemi", status: 1 },
});

// brandId must be Int
const brandIdNum = yuemiBrand.id; // just a number, no BigInt
const categoryIdNum = categoryId ? Number(categoryId) : null; // convert to Int if needed

// --- Create product inside a transaction ---
// --- Create product inside a transaction ---
const product = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
  const createdProduct = await tx.product.create({
    data: {
      productCode,
      name,
      slug,
      description,
      specifications,
      packaging,
      warranty,
      categoryName,
      deliveryTargetDays,
      weeklyProduct: weeklyProduct === "true",
      flashSaleProduct: flashSaleProduct === "true",
      todayDeals: todayDeals === "true",
      specialProduct: specialProduct === "true",
      brandName: "Yuemi",  // ✅ hardcoded brand name
      brandId: brandIdNum, // ✅ always use Yuemi's ID
      categoryId: categoryIdNum,
      mainImage: mainImagePath,
      productCatalog: productCatalogPath,
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

// --- GET all products ---
export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      category: true,
      brand: true,
      variations: true,
      reviews: true,
    },
  });

  return NextResponse.json({
    success: true,
    products: serializeBigInt(products),
  });
}
