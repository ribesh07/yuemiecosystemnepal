import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import fs from "fs";
import path from "path";
import {  GET_UPLOAD_BASE_DIR } from "../../../../utils/imageUpload"

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const { productCode, imagePath, type } = body;

    if (!productCode || !imagePath || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const productImages = await prisma.productImage.findUnique({
      where: { productCode },
    });

    if (!productImages) {
      return NextResponse.json(
        { success: false, message: "Product images not found" },
        { status: 404 }
      );
    }

    const filePath = path.join(GET_UPLOAD_BASE_DIR, imagePath);

    // 🗑️ Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 🧠 Handle DB update
    if (type === "main") {
      if (productImages.mainImage !== imagePath) {
        return NextResponse.json(
          { success: false, message: "Main image mismatch" },
          { status: 400 }
        );
      }

      await prisma.productImage.update({
        where: { productCode },
        data: { mainImage: null },
      });
    }

    if (type === "gallery") {
      const images = (productImages.imagePath as string[]) || [];

      const updatedImages = images.filter((img) => img !== imagePath);

      await prisma.productImage.update({
        where: { productCode },
        data: { imagePath: updatedImages },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("PRODUCT_IMAGE_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete image" },
      { status: 500 }
    );
  }
}


//  {
//   "productCode": "ABC123",
//   "imagePath": "/uploads",
//   "type": "gallery" // or "main"
// }

// await fetch("/api/products/images", {
//   method: "DELETE",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     productCode: "ABC123",
//     imagePath: "/uploads/ABC123/images/uuid.webp",
//     type: "gallery",
//   }),
// });
// await fetch("/api/products/images", {
//   method: "DELETE",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     productCode: "ABC123",
//     imagePath: "/uploads/ABC123/images/main-uuid.webp",
//     type: "main",
//   }),
// });
