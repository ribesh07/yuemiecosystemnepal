export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { requireAdminRole } from "@/lib/auth";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getProductImageDir, urlToFilePath } from "@/utils/imageUpload";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product id is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: BigInt(id) },
      include: {
        images: true,
        category: true,
        brand: true,
        variations: true,
        reviews: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeBigInt(product),
    });
  } catch (error) {
    console.error("PRODUCT_GET_BY_ID_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (process.env.NODE_ENV === "production") {
      await requireAdminRole("ADMIN");
    }

    const { id } = await context.params;
    const productId = BigInt(id);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const existingImages = await prisma.productImage.findUnique({
      where: { productCode: existingProduct.productCode },
    });

    const formData = await req.formData();

    // 🧾 Product fields
    const name = formData.get("name") as string | null;
    const slug = formData.get("slug") as string | null;
    const description = (formData.get("productDescription") ||
      formData.get("description")) as string | null;
    const specifications = (formData.get("keySpecifications") ||
      formData.get("specifications")) as string | null;
    const packaging = formData.get("packaging") as string | null;
    const warranty = formData.get("warranty") as string | null;
    const categoryId = formData.get("categoryId") as string | null;
    const categoryName = formData.get("categoryName") as string | null;
    const brandId = formData.get("brandId") as string | null;
    const deliveryTargetDays = formData.get("deliveryTargetDays") as string | null;
    const weeklyProduct = formData.get("weeklyProduct") as string | null;
    const flashSaleProduct = formData.get("flashSaleProduct") as string | null;
    const todayDeals = formData.get("todayDeals") as string | null;
    const specialProduct = formData.get("specialProduct") as string | null;
    const actualPrice = formData.get("actualPrice") as string | null;
    const sellPrice = (formData.get("sellPrice") ||
      formData.get("sellingPrice")) as string | null;
    const discount = formData.get("discount") as string | null;
    const stockQuantity = formData.get("stockQuantity") as string | null;
    const availableQuantity = formData.get("availableQuantity") as string | null;
    const status = formData.get("status") as string | null;

    // 🖼 Images
    const mainImageRaw = formData.get("mainImage");
    const newMainImage =
      mainImageRaw instanceof File && mainImageRaw.size > 0 ? mainImageRaw : null;
    const productCatalogRaw = formData.get("productCatalog");
    const newProductCatalog =
      productCatalogRaw instanceof File && productCatalogRaw.size > 0
        ? productCatalogRaw
        : null;
    const galleryInputs = [
      ...formData.getAll("images"),
      ...formData.getAll("productImages"),
    ];
    const newGalleryImages = galleryInputs.filter(
      (file): file is File =>
        file instanceof File && file.size > 0 && file.type.startsWith("image/")
    );

    const uploadDir = getProductImageDir(existingProduct.productCode);
    fs.mkdirSync(uploadDir, { recursive: true });

    let mainImagePath =
      existingImages?.mainImage || existingProduct.mainImage || null;
    let galleryImages: string[] = (existingImages?.imagePath as string[]) || [];
    let productCatalogPath = existingProduct.productCatalog || null;

    // 🔄 Replace main image
    if (newMainImage) {
      if (mainImagePath) {
        const oldPath = urlToFilePath(mainImagePath);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const ext = newMainImage.name.split(".").pop();
      const fileName = `main-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(
        filePath,
        Buffer.from(await newMainImage.arrayBuffer())
      );

      mainImagePath = `/uploads/products/${existingProduct.productCode}/images/${fileName}`;
    }

    // 🔄 Replace product catalog
    if (newProductCatalog) {
      if (productCatalogPath) {
        const oldCatalogPath = urlToFilePath(productCatalogPath);
        if (fs.existsSync(oldCatalogPath)) fs.unlinkSync(oldCatalogPath);
      }

      const ext = newProductCatalog.name.split(".").pop();
      const fileName = `catalog-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(
        filePath,
        Buffer.from(await newProductCatalog.arrayBuffer())
      );

      productCatalogPath = `/uploads/products/${existingProduct.productCode}/images/${fileName}`;
    }

    // ➕ Add new gallery images
    for (const file of newGalleryImages) {
      const ext = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(
        filePath,
        Buffer.from(await file.arrayBuffer())
      );

      galleryImages.push(
        `/uploads/products/${existingProduct.productCode}/images/${fileName}`
      );
    }

    // 🧱 Transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await tx.product.update({
        where: { id: productId },
        data: {
          ...(name && { name }),
          ...(slug && { slug }),
          ...(description && { description }),
          ...(specifications && { specifications }),
          ...(packaging && { packaging }),
          ...(warranty && { warranty }),
          ...(categoryId !== null && {
            categoryId: categoryId ? BigInt(categoryId) : null,
          }),
          ...(categoryName !== null && { categoryName }),
          ...(brandId !== null && {
            brandId: brandId ? Number(brandId) : null,
          }),
          ...(deliveryTargetDays !== null && {
            deliveryTargetDays: deliveryTargetDays ? Number(deliveryTargetDays) : null,
          }),
          ...(weeklyProduct !== null && { weeklyProduct: weeklyProduct === "true" }),
          ...(flashSaleProduct !== null && { flashSaleProduct: flashSaleProduct === "true" }),
          ...(todayDeals !== null && { todayDeals: todayDeals === "true" }),
          ...(specialProduct !== null && { specialProduct: specialProduct === "true" }),
          ...(actualPrice !== null && { actualPrice }),
          ...(sellPrice !== null && { sellPrice }),
          ...(discount !== null && { discount }),
          ...(stockQuantity !== null && {
            stockQuantity: BigInt(stockQuantity),
          }),
          ...(availableQuantity !== null && {
            availableQuantity: BigInt(availableQuantity),
          }),
          ...(status !== null && { status: Number(status) }),
          mainImage: mainImagePath,
          productCatalog: productCatalogPath,
        },
      });

      if (existingImages) {
        await tx.productImage.update({
          where: { productCode: existingProduct.productCode },
          data: {
            mainImage: mainImagePath,
            imagePath: galleryImages,
          },
        });
      } else {
        await tx.productImage.create({
          data: {
            productCode: existingProduct.productCode,
            mainImage: mainImagePath,
            imagePath: galleryImages,
          },
        });
      }

      return product;
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: serializeBigInt(result),
    });
  } catch (error) {
    console.error("PRODUCT_UPDATE_WITH_IMAGES_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}
